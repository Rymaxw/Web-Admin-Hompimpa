
import React from 'react';
import { Filter, ChevronDown, Plus, MoreHorizontal, Clock, ArrowRight, Minus, ChevronUp, Check } from 'lucide-react';
import { incidents } from '../mockData';
import { IncidentSeverity, Task } from '../types';
import { useTaskModal } from '../contexts/TaskModalContext';
import { useTaskContext } from '../contexts/TaskContext';

declare global {
  interface Window {
    L: any;
  }
}

const Dashboard: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = React.useState(incidents[0].id);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markersRef = React.useRef<any[]>([]);
  const taskMarkersRef = React.useRef<any[]>([]);
  const { openTaskForm } = useTaskModal();
  const { tasks } = useTaskContext();
  const [showAllTasks, setShowAllTasks] = React.useState(false);
  
  // Filter States
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [priorityFilter, setPriorityFilter] = React.useState<string>('All');

  // Filter Logic: Apply Priority Filter -> Then split for display
  const filteredTasksByPriority = React.useMemo(() => {
    if (priorityFilter === 'All') return tasks;
    return tasks.filter(t => t.priority === priorityFilter);
  }, [tasks, priorityFilter]);

  // For Sidebar: Filter that are active (not 'Selesai') based on the Priority Filter result
  const activeTasks = filteredTasksByPriority.filter(t => t.status !== 'Selesai');
  
  // Tasks to display in sidebar based on expand state
  const displayedTasks = showAllTasks ? activeTasks : activeTasks.slice(0, 3);

  // Initialize Leaflet Map
  React.useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    if (!mapInstanceRef.current) {
      // Create map instance
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false, 
        attributionControl: false
      }).setView([incidents[0].coordinates.lat, incidents[0].coordinates.lng], 12);

      // Add OpenStreetMap tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Update markers initially
    updateMarkers();

    // Clean up on unmount
    return () => {
    };
  }, []);

  // Effect to update task markers whenever tasks OR filter changes
  React.useEffect(() => {
    if (mapInstanceRef.current && window.L) {
      updateTaskMarkers(filteredTasksByPriority);
    }
  }, [tasks, priorityFilter]);

  // Handle Incident Markers
  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing incident markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    incidents.forEach(incident => {
      const color = incident.severity === IncidentSeverity.CRITICAL ? '#ef4444' : 
                    incident.severity === IncidentSeverity.HIGH ? '#f97316' : '#14b8a6';
      
      const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 drop-shadow-md">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      `;

      const icon = window.L.divIcon({
        className: 'custom-div-icon',
        html: svgIcon,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = window.L.marker([incident.coordinates.lat, incident.coordinates.lng], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-1">
            <h3 class="font-bold text-slate-800">${incident.name}</h3>
            <p class="text-xs text-slate-500">${incident.location}</p>
          </div>
        `);

      marker.on('click', () => {
        setSelectedIncident(incident.id);
      });

      markersRef.current.push(marker);
    });
    
    // Initial load uses all tasks (or filtered if state set)
    updateTaskMarkers(filteredTasksByPriority);
  };

  // Handle Task Markers
  const updateTaskMarkers = (tasksToRender: Task[]) => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing task markers
    taskMarkersRef.current.forEach(marker => marker.remove());
    taskMarkersRef.current = [];

    tasksToRender.forEach(task => {
        if (!task.coordinates) return;

        // Color based on Priority
        const color = task.priority === 'High' ? '#ef4444' : 
                      task.priority === 'Medium' ? '#f97316' : '#14b8a6';

        const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" class="w-4 h-4 drop-shadow-sm">
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
        `;

        const icon = window.L.divIcon({
            className: 'custom-div-icon',
            html: svgIcon,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -8]
        });

        const marker = window.L.marker([task.coordinates.lat, task.coordinates.lng], { icon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
                <div class="p-1 min-w-[150px]">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${task.type}</span>
                        <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                            task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'
                        }">${task.priority}</span>
                    </div>
                    <h4 class="font-bold text-sm text-slate-800 leading-tight my-1">${task.title}</h4>
                    <div class="flex items-center gap-2 mt-2">
                        <img src="${task.assigneeAvatar}" class="w-5 h-5 rounded-full object-cover" />
                        <span class="text-xs text-slate-600">${task.assignee}</span>
                    </div>
                </div>
            `);
        
        taskMarkersRef.current.push(marker);
    });
  };

  // React to selected incident change
  React.useEffect(() => {
    if (mapInstanceRef.current && window.L) {
      const incident = incidents.find(i => i.id === selectedIncident);
      if (incident) {
        mapInstanceRef.current.flyTo(
          [incident.coordinates.lat, incident.coordinates.lng], 
          13, 
          { duration: 1.5 }
        );
      }
    }
  }, [selectedIncident]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 md:flex-row">
      {/* Left Column: Map & Context */}
      <div className="flex flex-1 flex-col gap-6">
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Insiden Aktif</label>
            <div className="relative">
              <select 
                value={selectedIncident}
                onChange={(e) => setSelectedIncident(e.target.value)}
                className="w-full min-w-[240px] appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {incidents.map(inc => (
                  <option key={inc.id} value={inc.id}>{inc.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>
          
          <div className="relative">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${
                    priorityFilter !== 'All' 
                    ? 'border-primary bg-sky-50 text-primary' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
            >
                <Filter size={16} />
                {priorityFilter === 'All' ? 'Filter Prioritas' : `Prioritas: ${priorityFilter}`}
                <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
                    <div className="p-1">
                        <button 
                            onClick={() => { setPriorityFilter('All'); setIsFilterOpen(false); }}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <span>Semua</span>
                            {priorityFilter === 'All' && <Check size={14} className="text-primary" />}
                        </button>
                        <button 
                            onClick={() => { setPriorityFilter('High'); setIsFilterOpen(false); }}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                Tinggi
                            </span>
                            {priorityFilter === 'High' && <Check size={14} className="text-primary" />}
                        </button>
                        <button 
                            onClick={() => { setPriorityFilter('Medium'); setIsFilterOpen(false); }}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                                Sedang
                            </span>
                            {priorityFilter === 'Medium' && <Check size={14} className="text-primary" />}
                        </button>
                        <button 
                            onClick={() => { setPriorityFilter('Low'); setIsFilterOpen(false); }}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                                Rendah
                            </span>
                            {priorityFilter === 'Low' && <Check size={14} className="text-primary" />}
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Map Visualization */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm md:h-full z-0">
           <div id="map-container" ref={mapContainerRef} className="h-full w-full z-0" />

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[400]">
            <button onClick={handleZoomIn} className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md hover:bg-slate-50 text-slate-700 transition-colors">
              <Plus size={20} />
            </button>
            <button onClick={handleZoomOut} className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md hover:bg-slate-50 text-slate-700 transition-colors">
              <Minus size={20} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm z-[400]">
            <h4 className="mb-3 text-sm font-bold text-slate-800">Legenda</h4>
            <div className="space-y-2 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500 border border-white shadow-sm"></span>
                Prioritas Tinggi / Kritis
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-orange-500 border border-white shadow-sm"></span>
                Prioritas Menengah
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-teal-500 border border-white shadow-sm"></span>
                Prioritas Rendah / Selesai
              </div>
              <div className="mt-3 border-t border-slate-200 pt-2 flex items-center gap-2">
                 <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                 <span className="text-slate-500">Titik Tugas (Warna = Prioritas)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Task Board Summary */}
      <div className="w-full md:w-96 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Papan Tugas</h2>
          <button 
            onClick={openTaskForm}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-sky-600"
          >
            <Plus size={14} />
            Buat Tugas
          </button>
        </div>

        {/* Task Cards */}
        <div className="flex flex-col gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
          {displayedTasks.length > 0 ? displayedTasks.map(task => (
            <div key={task.id} className="group relative flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm">{task.title}</h3>
                <span className={`h-2 w-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-orange-500' : 'bg-teal-500'}`}></span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <img src={task.assigneeAvatar} alt={task.assignee} className="h-6 w-6 rounded-full border border-white shadow-sm object-cover" />
                  <span className="text-xs font-medium text-slate-500">{task.assignee}</span>
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  task.priority === 'High' ? 'bg-red-50 text-red-600' : task.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-teal-50 text-teal-600'
                }`}>
                  <Clock size={10} />
                  {task.dueDate}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-8 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                Tidak ada tugas ditemukan untuk filter ini.
            </div>
          )}
          
          <button 
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-primary hover:bg-slate-50 hover:text-primary transition-all"
          >
            {showAllTasks ? (
                <>
                    Tutup
                    <ChevronUp size={16} />
                </>
            ) : (
                <>
                    Lihat Semua Tugas
                    <ArrowRight size={16} />
                </>
            )}
          </button>
        </div>

        {/* Quick Stats or Updates */}
        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-lg mt-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">Status Relawan</h3>
            <MoreHorizontal size={20} className="text-slate-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-teal-400">24</p>
                <p className="text-xs text-slate-300">Aktif di Lapangan</p>
             </div>
             <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-orange-400">8</p>
                <p className="text-xs text-slate-300">Siaga</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
