
import React, { useEffect, useRef } from 'react';
import { X, Calendar, MapPin, User, Package, AlertTriangle } from 'lucide-react';
import { Task } from '../types';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || !task || !window.L || !task.coordinates) return;

    // Small timeout to allow DOM to render
    const timer = setTimeout(() => {
        if (!mapContainerRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
        }

        const map = window.L.map(mapContainerRef.current, {
            center: [task.coordinates!.lat, task.coordinates!.lng],
            zoom: 14,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        
        const color = task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f97316' : '#14b8a6';

        const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" class="w-8 h-8 drop-shadow-sm">
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
        `;
        const icon = window.L.divIcon({ className: 'custom-pin-icon', html: svgIcon, iconSize: [32, 32], iconAnchor: [16, 16] });
        
        window.L.marker([task.coordinates!.lat, task.coordinates!.lng], { icon }).addTo(map);

        mapInstanceRef.current = map;
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
                <h2 className="text-xl font-bold text-slate-900">{task.title}</h2>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{task.type}</span>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X size={24} /></button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">
            
            <div className="mb-6">
                <div className="flex items-start gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' :
                        task.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                        'bg-teal-100 text-teal-700'
                    }`}>
                        {task.priority} Priority
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        task.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {task.status}
                    </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {task.description || "Tidak ada deskripsi detail."}
                </p>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                    <img src={task.assigneeAvatar} alt={task.assignee} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100" />
                    <div>
                        <p className="text-xs text-slate-500">Penanggung Jawab</p>
                        <p className="font-bold text-slate-800">{task.assignee}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Calendar size={18} /></div>
                        <div>
                            <p className="text-xs text-slate-500">Jatuh Tempo</p>
                            <p className="font-medium text-sm text-slate-800">{task.dueDate}</p>
                        </div>
                    </div>
                </div>

                {task.resources && task.resources.length > 0 && (
                    <div className="mt-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Package size={16} className="text-slate-400"/>
                            <span className="text-sm font-bold text-slate-700">Sumber Daya</span>
                        </div>
                        <ul className="grid grid-cols-2 gap-2">
                            {task.resources.map((res, idx) => (
                                <li key={idx} className="bg-slate-50 px-3 py-2 rounded-lg text-sm border border-slate-100 flex justify-between">
                                    <span className="text-slate-700">{res.item}</span>
                                    <span className="font-bold text-slate-900">{res.quantity} {res.unit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {task.coordinates && (
                    <div className="mt-4">
                        <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-100 relative">
                             <div ref={mapContainerRef} className="h-full w-full opacity-90" />
                        </div>
                        <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={12}/> {task.coordinates.lat.toFixed(5)}, {task.coordinates.lng.toFixed(5)}
                        </p>
                    </div>
                )}
            </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end">
             <button onClick={onClose} className="px-5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
