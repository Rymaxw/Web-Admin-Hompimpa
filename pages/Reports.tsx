import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, Calendar } from 'lucide-react';

const dataArea = [
  { name: 'Sen', tasks: 12, resolved: 8 },
  { name: 'Sel', tasks: 19, resolved: 12 },
  { name: 'Rab', tasks: 15, resolved: 14 },
  { name: 'Kam', tasks: 22, resolved: 18 },
  { name: 'Jum', tasks: 30, resolved: 25 },
  { name: 'Sab', tasks: 35, resolved: 30 },
  { name: 'Min', tasks: 20, resolved: 18 },
];

const dataPie = [
  { name: 'Medis', value: 400 },
  { name: 'Logistik', value: 300 },
  { name: 'Penyelamatan', value: 300 },
  { name: 'Lainnya', value: 200 },
];

const COLORS = ['#0ea5e9', '#14b8a6', '#f97316', '#94a3b8'];

const Reports: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Laporan & Analitik</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Calendar size={18} />
            7 Hari Terakhir
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow hover:bg-sky-600">
            <Download size={18} />
            Ekspor PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Insiden', value: '12', change: '+2', color: 'text-blue-600' },
          { label: 'Tugas Selesai', value: '1,204', change: '+15%', color: 'text-teal-600' },
          { label: 'Relawan Aktif', value: '342', change: '+8%', color: 'text-orange-600' },
          { label: 'Waktu Respon', value: '1.2 Jam', change: '-10%', color: 'text-purple-600' },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <span className={`text-sm font-semibold ${stat.color}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-slate-800">Tren Penyelesaian Tugas</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataArea} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
                <Area type="monotone" dataKey="resolved" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-slate-800">Distribusi Jenis Bantuan</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
