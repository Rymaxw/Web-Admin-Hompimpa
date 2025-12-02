import React from 'react';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
        <p className="text-slate-500">Kelola profil dan preferensi akun Anda.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Profil Pengguna</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
               <img src="https://picsum.photos/seed/admin/150" alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
               <button className="text-sm font-semibold text-primary hover:text-sky-600">Ubah Foto</button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Nama Depan</label>
                 <input type="text" defaultValue="Admin" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Nama Belakang</label>
                 <input type="text" defaultValue="Hompimpa" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
               </div>
               <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-medium text-slate-700">Email</label>
                 <input type="email" defaultValue="admin@hompimpa.id" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
               </div>
            </div>
          </div>
        </section>

        {/* Org Settings */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Organisasi</h2>
          <div className="grid grid-cols-1 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Nama Organisasi</label>
                 <input type="text" defaultValue="Badan Penanggulangan Bencana" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Zona Waktu</label>
                 <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>(GMT+07:00) Jakarta</option>
                    <option>(GMT+08:00) Makassar</option>
                    <option>(GMT+09:00) Jayapura</option>
                 </select>
               </div>
          </div>
        </section>
        
        <div className="flex justify-end pt-4">
           <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-sky-600 transition-colors">
             <Save size={18} />
             Simpan Perubahan
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
