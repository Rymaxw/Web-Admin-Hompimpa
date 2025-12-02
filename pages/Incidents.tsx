import React from 'react';
import { Search, Filter, ArrowUpDown, Eye, Edit2, MoreVertical, Plus } from 'lucide-react';
import { incidents } from '../mockData';
import { IncidentSeverity, IncidentStatus } from '../types';

const Incidents: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Insiden</h1>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-sky-600 transition-colors">
          <Plus size={18} />
          Lapor Insiden Baru
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 rounded-xl bg-white p-2 shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari insiden..." 
            className="w-full rounded-lg bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter size={16} />
            Filter
           </button>
           <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <ArrowUpDown size={16} />
            Urutkan
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Insiden</th>
                <th className="px-6 py-4 font-semibold">Lokasi</th>
                <th className="px-6 py-4 font-semibold">Tanggal Dilaporkan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tingkat Keparahan</th>
                <th className="px-6 py-4 font-semibold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{incident.name}</td>
                  <td className="px-6 py-4 text-slate-600">{incident.location}</td>
                  <td className="px-6 py-4 text-slate-600">{incident.dateReported}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      incident.status === IncidentStatus.ACTIVE ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      incident.severity === IncidentSeverity.CRITICAL ? 'bg-red-100 text-red-700' : 
                      incident.severity === IncidentSeverity.HIGH ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary">
                        <Eye size={18} />
                      </button>
                      <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">Menampilkan 1 hingga 5 dari 24 insiden</p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="rounded-lg bg-primary px-3 py-1 text-sm font-medium text-white shadow-sm">1</button>
            <button className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50">2</button>
            <button className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Incidents;