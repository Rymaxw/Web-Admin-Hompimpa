
import React, { useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Activity, AlertTriangle } from 'lucide-react';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';

interface IncidentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
}

const IncidentViewModal: React.FC<IncidentViewModalProps> = ({ isOpen, onClose, incident }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || !incident || !window.L) return;

    // Small timeout to allow DOM to render
    const timer = setTimeout(() => {
        if (!mapContainerRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
        }

        const map = window.L.map(mapContainerRef.current, {
            center: [incident.coordinates.lat, incident.coordinates.lng],
            zoom: 12,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        
        const color = incident.severity === IncidentSeverity.CRITICAL ? '#ef4444' : 
                      incident.severity === IncidentSeverity.HIGH ? '#f97316' : 
                      incident.severity === IncidentSeverity.MEDIUM ? '#eab308' : '#14b8a6';

        const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8 drop-shadow-md">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
        `;
        const icon = window.L.divIcon({ className: 'custom-pin-icon', html: svgIcon, iconSize: [32, 32], iconAnchor: [16, 16] });
        
        window.L.marker([incident.coordinates.lat, incident.coordinates.lng], { icon }).addTo(map);

        mapInstanceRef.current = map;
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, incident]);

  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        
        <div className="relative h-40 bg-slate-100">
             <div ref={mapContainerRef} className="h-full w-full opacity-80" />
             <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-white p-2 shadow-sm hover:bg-slate-100 z-[400]"><X size={20} /></button>
        </div>

        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{incident.name}</h2>
                    <p className="text-slate-500 text-sm">{incident.location}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    incident.severity === IncidentSeverity.CRITICAL ? 'bg-red-100 text-red-700' :
                    incident.severity === IncidentSeverity.HIGH ? 'bg-orange-100 text-orange-700' : 
                    incident.severity === IncidentSeverity.MEDIUM ? 'bg-yellow-100 text-yellow-700' : 'bg-teal-100 text-teal-700'
                }`}>
                    {incident.severity}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Calendar size={18} /></div>
                    <div>
                        <p className="text-xs text-slate-500">Tanggal Dilaporkan</p>
                        <p className="font-medium">{incident.dateReported}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><Activity size={18} /></div>
                    <div>
                        <p className="text-xs text-slate-500">Status</p>
                        <p className="font-medium">{incident.status}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><MapPin size={18} /></div>
                    <div>
                        <p className="text-xs text-slate-500">Koordinat</p>
                        <p className="font-medium">{incident.coordinates.lat.toFixed(6)}, {incident.coordinates.lng.toFixed(6)}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200">Tutup</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentViewModal;
