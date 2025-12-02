
import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Save } from 'lucide-react';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';
import { useIncidentContext } from '../contexts/IncidentContext';

interface IncidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  incidentToEdit?: Incident | null;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ isOpen, onClose, incidentToEdit }) => {
  const { addIncident, updateIncident } = useIncidentContext();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [dateReported, setDateReported] = useState('');
  const [status, setStatus] = useState<IncidentStatus>(IncidentStatus.ACTIVE);
  const [severity, setSeverity] = useState<IncidentSeverity>(IncidentSeverity.MEDIUM);
  const [location, setLocation] = useState({ lat: -6.2088, lng: 106.8456 }); // Default Jakarta

  // Reset or Populate form
  useEffect(() => {
    if (isOpen) {
      if (incidentToEdit) {
        setName(incidentToEdit.name);
        setLocationName(incidentToEdit.location);
        setDateReported(incidentToEdit.dateReported);
        setStatus(incidentToEdit.status);
        setSeverity(incidentToEdit.severity);
        setLocation(incidentToEdit.coordinates);
      } else {
        // Reset for new incident
        setName('');
        setLocationName('');
        setDateReported(new Date().toISOString().split('T')[0]);
        setStatus(IncidentStatus.ACTIVE);
        setSeverity(IncidentSeverity.MEDIUM);
        setLocation({ lat: -6.2088, lng: 106.8456 });
      }
    }
  }, [isOpen, incidentToEdit]);

  // Map Initialization
  useEffect(() => {
    if (!isOpen) return;

    const initMap = () => {
      if (!mapContainerRef.current || !window.L) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }

      const map = window.L.map(mapContainerRef.current, {
        center: [location.lat, location.lng],
        zoom: 10,
        attributionControl: false
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      // Icon Logic
      const getColor = (s: string) => {
        if (s === IncidentSeverity.CRITICAL) return '#ef4444';
        if (s === IncidentSeverity.HIGH) return '#f97316';
        if (s === IncidentSeverity.MEDIUM) return '#eab308';
        return '#14b8a6';
      };

      const updateMarkerIcon = (sev: string) => {
         const color = getColor(sev);
         return window.L.divIcon({
            className: 'custom-pin-icon',
            html: `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 drop-shadow-md">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" stroke-width="3" stroke-linecap="round"/>
              </svg>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });
      };

      const marker = window.L.marker([location.lat, location.lng], { 
          icon: updateMarkerIcon(severity),
          draggable: true 
      }).addTo(map);
      
      markerRef.current = marker;

      // Map Click Event
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      });

      // Marker Drag Event
      marker.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        setLocation({ lat, lng });
      });

      mapInstanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 300);
    };

    const timer = setTimeout(initMap, 100);
    return () => clearTimeout(timer);
  }, [isOpen, location.lat, location.lng]); // Re-init if location changes significantly (like edit load) or open

  // Update marker color when severity changes
  useEffect(() => {
      if(isOpen && markerRef.current && window.L) {
          const getColor = (s: string) => {
            if (s === IncidentSeverity.CRITICAL) return '#ef4444';
            if (s === IncidentSeverity.HIGH) return '#f97316';
            if (s === IncidentSeverity.MEDIUM) return '#eab308';
            return '#14b8a6';
          };
          const color = getColor(severity);
          const icon = window.L.divIcon({
            className: 'custom-pin-icon',
            html: `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 drop-shadow-md">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" stroke-width="3" stroke-linecap="round"/>
              </svg>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });
        markerRef.current.setIcon(icon);
      }
  }, [severity, isOpen]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incidentData: Incident = {
      id: incidentToEdit ? incidentToEdit.id : Date.now().toString(),
      name,
      location: locationName,
      dateReported,
      status,
      severity,
      coordinates: location
    };

    if (incidentToEdit) {
      updateIncident(incidentData);
    } else {
      addIncident(incidentData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-lg transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out">
        
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">{incidentToEdit ? 'Edit Insiden' : 'Lapor Insiden Baru'}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="incident-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nama Insiden <span className="text-red-500">*</span></label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Contoh: Banjir Bandang..." />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Lokasi (Nama Tempat) <span className="text-red-500">*</span></label>
              <input required type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Contoh: Garut, Jawa Barat" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Tanggal Dilaporkan <span className="text-red-500">*</span></label>
                  <input required type="date" value={dateReported} onChange={(e) => setDateReported(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
               </div>
               <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status <span className="text-red-500">*</span></label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as IncidentStatus)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                      {Object.values(IncidentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tingkat Keparahan <span className="text-red-500">*</span></label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value as IncidentSeverity)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  {Object.values(IncidentSeverity).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Titik Koordinat</label>
                <div className="h-48 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 relative z-0">
                    <div ref={mapContainerRef} className="h-full w-full z-0" />
                </div>
                <p className="mt-1 text-xs text-slate-500">Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}</p>
            </div>
          </form>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Batal</button>
            <button type="submit" form="incident-form" className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-sky-600">
              <Save size={18} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IncidentForm;
