import React from 'react';
import { Search, MapPin, Award, Phone } from 'lucide-react';
import { volunteers } from '../mockData';

const Volunteers: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Relawan</h1>
           <p className="text-slate-500 mt-1">Kelola dan tugaskan relawan untuk insiden.</p>
        </div>
        <div className="flex items-center gap-3">
             <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">Tersedia</button>
             <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">Ditugaskan</button>
             <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-sky-600">Tambah Relawan</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {volunteers.map((vol) => (
          <div key={vol.id} className="relative flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <span className={`absolute top-4 right-4 h-3 w-3 rounded-full ${
                vol.status === 'Tersedia' ? 'bg-teal-500' : 'bg-orange-500'
            } ring-2 ring-white`} title={vol.status}></span>
            
            <img src={vol.avatar} alt={vol.name} className="mb-4 h-24 w-24 rounded-full border-4 border-slate-50 object-cover shadow-sm" />
            
            <h3 className="text-lg font-bold text-slate-800">{vol.name}</h3>
            <p className="text-sm font-medium text-slate-500">{vol.role}</p>

            <div className="my-4 flex flex-wrap justify-center gap-2">
              {vol.skills.map(skill => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-auto flex w-full gap-2">
              <button className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                Profil
              </button>
              <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-bold text-white shadow-sm hover:bg-sky-600 transition-colors">
                Tugaskan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Volunteers;
