
import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Search, Plus, Trash2, Save } from 'lucide-react';
import { useTaskModal } from '../contexts/TaskModalContext';
import { useTaskContext } from '../contexts/TaskContext';
import { incidents, volunteers } from '../mockData';
import { TaskStatus, TaskType } from '../types';

declare global {
  interface Window {
    L: any;
  }
}

const CreateTaskForm: React.FC = () => {
  const { isOpen, closeTaskForm } = useTaskModal();
  const { addTask } = useTaskContext();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [incidentId, setIncidentId] = useState(incidents[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<any>(null);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [location, setLocation] = useState({ lat: -7.2278, lng: 107.9087 }); // Default to Garut
  const [locationName, setLocationName] = useState('');
  const [taskType, setTaskType] = useState<TaskType>(TaskType.LOGISTICS);
  
  // Resource State
  const [resources, setResources] = useState<{ id: number; item: string; quantity: number }[]>([
    { id: 1, item: '', quantity: 1 }
  ]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setResources([{ id: 1, item: '', quantity: 1 }]);
        setAssigneeSearch('');
        setSelectedAssignee(null);
    }
  }, [isOpen]);

  // Helper to get color based on priority
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return '#ef4444'; // Red
      case 'Medium': return '#f97316'; // Orange
      case 'Low': return '#14b8a6'; // Teal
      default: return '#3b82f6'; // Blue
    }
  };

  // Update marker visual
  const updateMarker = (map: any, lat: number, lng: number, currentPriority: string) => {
    if (!window.L) return;
    
    const color = getPriorityColor(currentPriority);

    // Custom icon for the pin with dynamic color
    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-md">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
    `;
    const icon = window.L.divIcon({
        className: 'custom-pin-icon',
        html: svgIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setIcon(icon); // Update icon to reflect new color
    } else {
      markerRef.current = window.L.marker([lat, lng], { icon, draggable: true }).addTo(map);
      markerRef.current.on('dragend', (event: any) => {
        const position = event.target.getLatLng();
        setLocation({ lat: position.lat, lng: position.lng });
        setLocationName(`${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`);
      });
    }
  };

  // Effect to update marker color when priority changes
  useEffect(() => {
    if (isOpen && mapInstanceRef.current) {
        updateMarker(mapInstanceRef.current, location.lat, location.lng, priority);
    }
  }, [priority, isOpen]);

  // Initialize Map when modal opens with stricter cleanup and sizing logic
  useEffect(() => {
    if (!isOpen) return;

    const initMap = () => {
        if (!mapContainerRef.current || !window.L) return;

        // Cleanup existing map if present to prevent initialization error
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        }

        // Create new map instance
        const map = window.L.map(mapContainerRef.current, {
            center: [location.lat, location.lng],
            zoom: 13,
            attributionControl: false
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Click handler
        map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            setLocation({ lat, lng });
            // Use the current priority ref or state
            updateMarker(map, lat, lng, priority);
            setLocationName(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        });

        // Add initial marker
        updateMarker(map, location.lat, location.lng, priority);
        
        mapInstanceRef.current = map;

        // CRITICAL: Invalidate size after a short delay to ensure modal transition is done
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    };

    // Initialize using setTimeout to wait for DOM rendering
    const timer = setTimeout(initMap, 100);

    return () => {
        clearTimeout(timer);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        }
    };
  }, [isOpen]); // Re-run only when isOpen changes

  const handleAddResource = () => {
    setResources([...resources, { id: Date.now(), item: '', quantity: 1 }]);
  };

  const handleRemoveResource = (id: number) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleResourceChange = (id: number, field: 'item' | 'quantity', value: string | number) => {
    setResources(resources.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new task object
    const newTask = {
      id: Date.now().toString(),
      title,
      assignee: selectedAssignee ? selectedAssignee.name : 'Unassigned',
      assigneeAvatar: selectedAssignee ? selectedAssignee.avatar : 'https://picsum.photos/seed/unknown/200',
      status: TaskStatus.OPEN,
      type: taskType,
      dueDate: dueDate ? new Date(dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Segera',
      priority,
      incidentId,
      coordinates: location
    };

    addTask(newTask);
    closeTaskForm();
  };

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(assigneeSearch.toLowerCase()) || 
    v.role.toLowerCase().includes(assigneeSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={closeTaskForm}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-2xl transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Buat Tugas Baru</h2>
            <p className="text-sm text-slate-500">Isi detail tugas untuk penanganan insiden.</p>
          </div>
          <button 
            onClick={closeTaskForm}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <form id="create-task-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section A: Detail Tugas */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">A</span>
                Detail Tugas
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nama Tugas <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Kirim Pasokan Logistik ke Posko A"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi Detail <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan instruksi spesifik untuk relawan..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Tingkat Prioritas <span className="text-red-500">*</span></label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="High">Tinggi / Kritis</option>
                      <option value="Medium">Sedang</option>
                      <option value="Low">Rendah</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Jenis Tugas <span className="text-red-500">*</span></label>
                    <select 
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value as TaskType)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value={TaskType.LOGISTICS}>Logistik</option>
                      <option value={TaskType.MEDICAL}>Medis</option>
                      <option value={TaskType.RESCUE}>Penyelamatan</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Section B: Alokasi */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">B</span>
                Alokasi
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Insiden Terkait <span className="text-red-500">*</span></label>
                  <select 
                    value={incidentId}
                    onChange={(e) => setIncidentId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {incidents.map(inc => (
                      <option key={inc.id} value={inc.id}>{inc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="relative md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Penanggung Jawab</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Cari relawan..."
                      value={assigneeSearch}
                      onChange={(e) => {
                        setAssigneeSearch(e.target.value);
                        setShowAssigneeDropdown(true);
                      }}
                      onFocus={() => setShowAssigneeDropdown(true)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 pl-9 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  
                  {showAssigneeDropdown && (
                    <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                      {filteredVolunteers.length > 0 ? (
                        filteredVolunteers.map(vol => (
                          <div 
                            key={vol.id}
                            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50"
                            onClick={() => {
                              setSelectedAssignee(vol);
                              setAssigneeSearch(vol.name);
                              setShowAssigneeDropdown(false);
                            }}
                          >
                            <img src={vol.avatar} alt={vol.name} className="h-8 w-8 rounded-full object-cover" />
                            <div>
                              <p className="text-sm font-bold text-slate-800">{vol.name}</p>
                              <p className="text-xs text-slate-500">{vol.role}</p>
                            </div>
                            {vol.status === 'Tersedia' ? (
                                <span className="ml-auto text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Tersedia</span>
                            ) : (
                                <span className="ml-auto text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Sibuk</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-slate-500">Relawan tidak ditemukan</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Jatuh Tempo <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      required
                      type="datetime-local" 
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section C: Lokasi & Sumber Daya */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">C</span>
                Lokasi & Sumber Daya
              </h3>
              
              <div className="mb-6 space-y-3">
                <label className="mb-1 block text-sm font-medium text-slate-700">Titik Lokasi Tugas</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={locationName}
                        readOnly
                        placeholder="Klik pada peta untuk set lokasi"
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                    />
                    <button type="button" className="shrink-0 rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
                        <MapPin size={20} className="text-slate-500" />
                    </button>
                </div>
                {/* Map Container */}
                <div className="h-48 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 relative z-0">
                    <div ref={mapContainerRef} className="h-full w-full z-0" />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-[10px] rounded shadow z-[400] pointer-events-none">
                        Klik peta untuk set pin
                    </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Kebutuhan Sumber Daya</label>
                <div className="space-y-3">
                  {resources.map((res, index) => (
                    <div key={res.id} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nama Item (misal: Air Bersih)"
                        value={res.item}
                        onChange={(e) => handleResourceChange(res.id, 'item', e.target.value)}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input 
                        type="number" 
                        placeholder="Jml"
                        min="1"
                        value={res.quantity}
                        onChange={(e) => handleResourceChange(res.id, 'quantity', parseInt(e.target.value))}
                        className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {resources.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveResource(res.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={handleAddResource}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-sky-600"
                  >
                    <Plus size={16} />
                    Tambah Item
                  </button>
                </div>
              </div>
            </section>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={closeTaskForm}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            >
              Batal
            </button>
            <button 
              type="submit" 
              form="create-task-form"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-sky-600 hover:shadow-md transition-all"
            >
              <Save size={18} />
              Buat & Tugaskan
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default CreateTaskForm;
