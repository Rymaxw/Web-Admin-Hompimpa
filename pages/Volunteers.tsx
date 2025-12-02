
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Phone, Mail, Filter, Edit2, Trash2, Plus, ChevronLeft, ArrowRight, Users, Briefcase, Heart } from 'lucide-react';
import { useVolunteerContext } from '../contexts/VolunteerContext';
import VolunteerForm from '../components/VolunteerForm';
import { Volunteer } from '../types';

const Volunteers: React.FC = () => {
  const { volunteers, deleteVolunteer } = useVolunteerContext();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  // States for Detail View (Grid)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  // --- Derived Data ---

  // Group Volunteers by Location
  const locationStats = useMemo(() => {
    const stats: Record<string, { location: string; total: number; available: number; assigned: number; roles: Record<string, number> }> = {};

    volunteers.forEach(vol => {
      const loc = vol.location || 'Tidak Diketahui';
      if (!stats[loc]) {
        stats[loc] = { location: loc, total: 0, available: 0, assigned: 0, roles: {} };
      }
      stats[loc].total++;
      if (vol.status === 'Tersedia') stats[loc].available++;
      if (vol.status === 'Ditugaskan') stats[loc].assigned++;
      
      // Count Roles (simplified for diversity display)
      const roleKey = vol.role.split(' ')[0]; // Take first word
      stats[loc].roles[roleKey] = (stats[loc].roles[roleKey] || 0) + 1;
    });

    return Object.values(stats);
  }, [volunteers]);

  // Extract all unique skills for filter
  const allSkills = useMemo(() => Array.from(new Set(volunteers.flatMap(v => v.skills))), [volunteers]);

  // Filter logic for detail view
  const filteredVolunteers = useMemo(() => {
    if (!selectedLocation) return [];
    return volunteers.filter(vol => {
        const matchesLoc = (vol.location || 'Tidak Diketahui') === selectedLocation;
        const matchesSearch = vol.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              vol.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSkill = filterSkill === '' || vol.skills.includes(filterSkill);
        return matchesLoc && matchesSearch && matchesSkill;
    });
  }, [volunteers, selectedLocation, searchTerm, filterSkill]);

  // Handlers
  const handleEdit = (vol: Volunteer) => {
    setSelectedVolunteer(vol);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedVolunteer(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Apakah Anda yakin ingin menghapus data relawan ini?')) {
        deleteVolunteer(id);
    }
  };

  // --- Render Views ---

  // 1. DETAIL VIEW: Grid of Volunteers in selected location
  if (selectedLocation) {
    return (
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
            <button 
                onClick={() => setSelectedLocation(null)}
                className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary w-fit transition-colors"
            >
                <ChevronLeft size={16} />
                Kembali ke Daftar Lokasi
            </button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <MapPin className="text-primary" />
                        {selectedLocation}
                    </h1>
                    <p className="text-slate-500 mt-1">Daftar relawan yang ditugaskan atau tersedia di lokasi ini.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow hover:bg-sky-600 transition-colors"
                >
                    <Plus size={18} />
                    Tambah Relawan
                </button>
            </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                type="text" 
                placeholder="Cari nama atau peran..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>
            <div className="relative min-w-[200px]">
                <select 
                    value={filterSkill} 
                    onChange={(e) => setFilterSkill(e.target.value)}
                    className="w-full h-full appearance-none rounded-lg border-l border-slate-100 bg-white py-2.5 pl-4 pr-10 text-sm font-medium outline-none focus:bg-slate-50"
                >
                    <option value="">Semua Keahlian</option>
                    {allSkills.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVolunteers.length > 0 ? (
                filteredVolunteers.map((vol) => (
                <div key={vol.id} className="relative group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        vol.status === 'Tersedia' ? 'bg-teal-50 text-teal-600' : 
                        vol.status === 'Ditugaskan' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {vol.status}
                    </div>

                    {/* Edit/Delete Actions */}
                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(vol)} className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-primary hover:bg-blue-50">
                            <Edit2 size={14}/>
                        </button>
                        <button onClick={() => handleDelete(vol.id)} className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-red-500 hover:bg-red-50">
                            <Trash2 size={14}/>
                        </button>
                    </div>
                    
                    <img src={vol.avatar} alt={vol.name} className="mb-4 h-24 w-24 rounded-full border-4 border-slate-50 object-cover shadow-sm" />
                    
                    <h3 className="text-lg font-bold text-slate-800 text-center">{vol.name}</h3>
                    <p className="text-sm font-medium text-slate-500 text-center">{vol.role}</p>

                    {/* Contact Actions */}
                    <div className="flex gap-4 my-3 w-full justify-center">
                        <a href={`mailto:${vol.email}`} title={vol.email} className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-colors">
                            <Mail size={16} />
                        </a>
                        <a href={`tel:${vol.phone}`} title={vol.phone} className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-colors">
                            <Phone size={16} />
                        </a>
                    </div>

                    <div className="mb-4 flex flex-wrap justify-center gap-2 w-full">
                    {vol.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                        {skill}
                        </span>
                    ))}
                    {vol.skills.length > 3 && (
                        <span className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-400 border border-slate-100">
                        +{vol.skills.length - 3}
                        </span>
                    )}
                    </div>

                    <div className="mt-auto w-full">
                        <button className="w-full rounded-lg bg-primary py-2 text-sm font-bold text-white shadow-sm hover:bg-sky-600 transition-colors">
                            Lihat Profil
                        </button>
                    </div>
                </div>
                ))
            ) : (
                <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                    Tidak ada relawan yang cocok dengan pencarian Anda di lokasi ini.
                </div>
            )}
        </div>

        <VolunteerForm 
            isOpen={isFormOpen} 
            onClose={() => setIsFormOpen(false)} 
            volunteerToEdit={selectedVolunteer} 
        />
      </div>
    );
  }

  // 2. MASTER VIEW: List of Locations
  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Manajemen Relawan</h1>
                <p className="text-slate-500 mt-1">Pilih lokasi untuk mengelola relawan.</p>
            </div>
            <button 
                onClick={handleCreate}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-sky-600 transition-colors"
            >
                <Plus size={18} />
                Tambah Relawan
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {locationStats.map(stat => (
                <div 
                    key={stat.location} 
                    onClick={() => setSelectedLocation(stat.location)}
                    className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <MapPin size={100} className="text-primary"/>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">{stat.location}</h3>
                                <p className="text-sm text-slate-500 font-medium">{stat.total} Relawan Terdaftar</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                    <span className="text-xs font-bold text-teal-700 uppercase">Tersedia</span>
                                </div>
                                <span className="text-2xl font-bold text-slate-800">{stat.available}</span>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                    <span className="text-xs font-bold text-orange-700 uppercase">Ditugaskan</span>
                                </div>
                                <span className="text-2xl font-bold text-slate-800">{stat.assigned}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Komposisi Tim</p>
                             <div className="flex flex-wrap gap-2">
                                {Object.entries(stat.roles).slice(0,3).map(([role, count]) => (
                                    <span key={role} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                        {count} {role}
                                    </span>
                                ))}
                                {Object.keys(stat.roles).length > 3 && (
                                    <span className="text-xs bg-slate-50 text-slate-400 px-2 py-1 rounded border border-slate-100">
                                        +{Object.keys(stat.roles).length - 3} lainnya
                                    </span>
                                )}
                             </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-primary">
                            <span>Kelola Tim</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <VolunteerForm 
            isOpen={isFormOpen} 
            onClose={() => setIsFormOpen(false)} 
            volunteerToEdit={selectedVolunteer} 
        />
    </div>
  );
};

export default Volunteers;
