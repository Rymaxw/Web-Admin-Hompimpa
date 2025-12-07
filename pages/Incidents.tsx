
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Eye, Edit2, Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';
import { useIncidentContext } from '../contexts/IncidentContext';
import IncidentForm from '../components/IncidentForm';
import IncidentViewModal from '../components/IncidentViewModal';

const Incidents: React.FC = () => {
  const { incidents } = useIncidentContext();
  
  // States for UI Logic
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('DateDesc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dropdown UI States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // --- Logic Processing ---

  // 1. Filtering
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          incident.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || incident.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  // 2. Sorting
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    switch (sortOption) {
      case 'DateDesc':
        return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
      case 'DateAsc':
        return new Date(a.dateReported).getTime() - new Date(b.dateReported).getTime();
      case 'NameAsc':
        return a.name.localeCompare(b.name);
      case 'SeverityDesc':
        const severityWeight = { [IncidentSeverity.CRITICAL]: 4, [IncidentSeverity.HIGH]: 3, [IncidentSeverity.MEDIUM]: 2, [IncidentSeverity.LOW]: 1 };
        return (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
      case 'Status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // 3. Pagination
  const totalPages = Math.ceil(sortedIncidents.length / itemsPerPage);
  const paginatedIncidents = sortedIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleEdit = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsFormOpen(true);
  };

  const handleView = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsViewOpen(true);
  };

  const handleCreate = () => {
    setSelectedIncident(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Insiden</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-sky-600 transition-colors"
        >
          <Plus size={18} />
          Lapor Insiden Baru
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 rounded-xl bg-white p-2 shadow-sm border border-slate-100 z-10">

        <div className="flex gap-2 relative">
           
           {/* Filter Dropdown */}
           <div className="relative">
             <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${severityFilter !== 'All' ? 'border-primary bg-sky-50 text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
                <Filter size={16} />
                Filter
             </button>
             {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-20">
                    <button onClick={() => { setSeverityFilter('All'); setIsFilterOpen(false); setCurrentPage(1); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50">Semua {severityFilter === 'All' && <Check size={14}/>}</button>
                    {Object.values(IncidentSeverity).map(sev => (
                        <button key={sev} onClick={() => { setSeverityFilter(sev); setIsFilterOpen(false); setCurrentPage(1); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50">{sev} {severityFilter === sev && <Check size={14}/>}</button>
                    ))}
                </div>
             )}
           </div>

           {/* Sort Dropdown */}
           <div className="relative">
             <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
             >
                <ArrowUpDown size={16} />
                Urutkan
             </button>
             {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-20">
                    <button onClick={() => { setSortOption('DateDesc'); setIsSortOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50">Tanggal (Terbaru) {sortOption === 'DateDesc' && <Check size={14}/>}</button>
                    <button onClick={() => { setSortOption('DateAsc'); setIsSortOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50">Tanggal (Terlama) {sortOption === 'DateAsc' && <Check size={14}/>}</button>
                    <button onClick={() => { setSortOption('SeverityDesc'); setIsSortOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50">Keparahan (Tinggi-Rendah) {sortOption === 'SeverityDesc' && <Check size={14}/>}</button>
                    <button onClick={() => { setSortOption('NameAsc'); setIsSortOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50">Nama (A-Z) {sortOption === 'NameAsc' && <Check size={14}/>}</button>
                    <button onClick={() => { setSortOption('Status'); setIsSortOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50">Status {sortOption === 'Status' && <Check size={14}/>}</button>
                </div>
             )}
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm min-h-[400px] flex flex-col">
        <div className="overflow-x-auto flex-1">
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
              {paginatedIncidents.length > 0 ? (
                paginatedIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{incident.name}</td>
                    <td className="px-6 py-4 text-slate-600">{incident.location}</td>
                    <td className="px-6 py-4 text-slate-600">{incident.dateReported}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        incident.status === IncidentStatus.ACTIVE ? 'bg-blue-100 text-blue-700' : 
                        incident.status === IncidentStatus.RESOLVED ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        incident.severity === IncidentSeverity.CRITICAL ? 'bg-red-100 text-red-700' : 
                        incident.severity === IncidentSeverity.HIGH ? 'bg-orange-100 text-orange-700' : 
                        incident.severity === IncidentSeverity.MEDIUM ? 'bg-yellow-100 text-yellow-700' : 'bg-teal-100 text-teal-700'
                      }`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleView(incident)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleEdit(incident)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors">
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Tidak ada insiden yang ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-white">
          <p className="text-sm text-slate-500">
             Menampilkan {sortedIncidents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} hingga {Math.min(currentPage * itemsPerPage, sortedIncidents.length)} dari {sortedIncidents.length} insiden
          </p>
          <div className="flex gap-2">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={16} className="mr-1"/> Prev
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                        currentPage === page 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next <ChevronRight size={16} className="ml-1"/>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <IncidentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        incidentToEdit={selectedIncident} 
      />
      <IncidentViewModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        incident={selectedIncident} 
      />
    </div>
  );
};

export default Incidents;
