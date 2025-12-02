
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Volunteer } from '../types';
import { useVolunteerContext } from '../contexts/VolunteerContext';
import { useIncidentContext } from '../contexts/IncidentContext';

interface VolunteerFormProps {
  isOpen: boolean;
  onClose: () => void;
  volunteerToEdit?: Volunteer | null;
}

const VolunteerForm: React.FC<VolunteerFormProps> = ({ isOpen, onClose, volunteerToEdit }) => {
  const { addVolunteer, updateVolunteer } = useVolunteerContext();
  const { incidents } = useIncidentContext();
  
  // State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'Tersedia' | 'Ditugaskan' | 'Istirahat'>('Tersedia');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [location, setLocation] = useState('Pool Jakarta');

  useEffect(() => {
    if (isOpen) {
      if (volunteerToEdit) {
        setName(volunteerToEdit.name);
        setRole(volunteerToEdit.role);
        setStatus(volunteerToEdit.status);
        setEmail(volunteerToEdit.email || '');
        setPhone(volunteerToEdit.phone || '');
        setSkills(volunteerToEdit.skills);
        setLocation(volunteerToEdit.location);
      } else {
        setName('');
        setRole('');
        setStatus('Tersedia');
        setEmail('');
        setPhone('');
        setSkills([]);
        setLocation('Pool Jakarta');
      }
    }
  }, [isOpen, volunteerToEdit]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const volunteerData: Volunteer = {
      id: volunteerToEdit ? volunteerToEdit.id : Date.now().toString(),
      name,
      role,
      status,
      email,
      phone,
      skills,
      location,
      avatar: volunteerToEdit ? volunteerToEdit.avatar : `https://ui-avatars.com/api/?name=${name}&background=random`
    };

    if (volunteerToEdit) {
      updateVolunteer(volunteerData);
    } else {
      addVolunteer(volunteerData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-lg transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out">
        
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">{volunteerToEdit ? 'Edit Relawan' : 'Tambah Relawan Baru'}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="volunteer-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Nama Relawan" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Peran / Posisi <span className="text-red-500">*</span></label>
              <input required type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Contoh: Dokter Medis, Driver" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
               </div>
               <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nomor Telepon</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
               </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Lokasi Penugasan <span className="text-red-500">*</span></label>
              <div className="flex flex-col gap-2">
                 <select 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                 >
                    <option value="Pool Jakarta">Pool Jakarta (Standby)</option>
                    {incidents.map(inc => (
                        <option key={inc.id} value={inc.location}>{inc.name} ({inc.location})</option>
                    ))}
                    <option value="Lainnya">Lainnya...</option>
                 </select>
                 {location === 'Lainnya' && (
                     <input 
                        type="text" 
                        placeholder="Ketik nama lokasi..."
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        onChange={(e) => setLocation(e.target.value)}
                     />
                 )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status <span className="text-red-500">*</span></label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="Tersedia">Tersedia</option>
                  <option value="Ditugaskan">Ditugaskan</option>
                  <option value="Istirahat">Istirahat</option>
              </select>
            </div>

            <div>
               <label className="mb-1 block text-sm font-medium text-slate-700">Keahlian (Skills)</label>
               <div className="flex gap-2 mb-2">
                 <input 
                    type="text" 
                    value={currentSkill} 
                    onChange={(e) => setCurrentSkill(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                    placeholder="Tambah keahlian..." 
                 />
                 <button type="button" onClick={handleAddSkill} className="px-3 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200"><Plus size={18}/></button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {skills.map(skill => (
                    <span key={skill} className="flex items-center gap-1 bg-sky-50 text-primary px-3 py-1 rounded-full text-xs font-bold border border-sky-100">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500"><X size={12}/></button>
                    </span>
                 ))}
               </div>
            </div>

          </form>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Batal</button>
            <button type="submit" form="volunteer-form" className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-sky-600">
              <Save size={18} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VolunteerForm;
