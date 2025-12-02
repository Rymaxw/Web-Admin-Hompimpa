
import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, Calendar, Filter } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';
import { useIncidentContext } from '../contexts/IncidentContext';
import { useVolunteerContext } from '../contexts/VolunteerContext';
import { TaskStatus } from '../types';

const COLORS = ['#0ea5e9', '#14b8a6', '#f97316', '#8b5cf6'];

const Reports: React.FC = () => {
  const { tasks } = useTaskContext();
  const { incidents } = useIncidentContext();
  const { volunteers } = useVolunteerContext();
  
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('all');

  // --- Derived Data Logic ---

  // 1. Filter Data based on selection
  const filteredData = useMemo(() => {
    const selectedIncident = incidents.find(i => i.id === selectedIncidentId);
    
    // Filter Tasks
    const currentTasks = selectedIncidentId === 'all' 
      ? tasks 
      : tasks.filter(t => t.incidentId === selectedIncidentId);

    // Filter Volunteers (Matched by Location Name)
    const currentVolunteers = selectedIncidentId === 'all'
      ? volunteers
      : volunteers.filter(v => v.location === selectedIncident?.location);

    return { tasks: currentTasks, volunteers: currentVolunteers };
  }, [selectedIncidentId, tasks, volunteers, incidents]);

  // 2. Calculate Statistics
  const stats = useMemo(() => {
    const { tasks: t, volunteers: v } = filteredData;
    
    const totalTasks = t.length;
    const completedTasks = t.filter(task => task.status === TaskStatus.DONE).length;
    
    // Calculate resources: Sum of all quantities in resources array of all tasks
    const totalResources = t.reduce((acc, task) => {
      const taskResources = task.resources?.reduce((sum, res) => sum + (res.quantity || 0), 0) || 0;
      return acc + taskResources;
    }, 0);

    const activeVolunteers = v.filter(vol => vol.status !== 'Istirahat').length;

    // Mock completion rate change
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      completedTasks,
      totalResources,
      activeVolunteers,
      completionRate,
      totalIncidents: incidents.length
    };
  }, [filteredData, incidents]);

  // 3. Prepare Chart Data (Pie - Task Types)
  const pieData = useMemo(() => {
    const { tasks: t } = filteredData;
    const distribution: Record<string, number> = {};
    
    t.forEach(task => {
      distribution[task.type] = (distribution[task.type] || 0) + 1;
    });

    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // 4. Mock Area Data (Scaled by total tasks to look dynamic)
  // In a real app, this would aggregate by created_at or completed_at dates
  const areaData = useMemo(() => {
    const base = filteredData.tasks.length;
    return [
      { name: 'Sen', tasks: Math.round(base * 0.2), resolved: Math.round(base * 0.1) },
      { name: 'Sel', tasks: Math.round(base * 0.4), resolved: Math.round(base * 0.25) },
      { name: 'Rab', tasks: Math.round(base * 0.3), resolved: Math.round(base * 0.2) },
      { name: 'Kam', tasks: Math.round(base * 0.6), resolved: Math.round(base * 0.4) },
      { name: 'Jum', tasks: Math.round(base * 0.8), resolved: Math.round(base * 0.6) },
      { name: 'Sab', tasks: Math.round(base * 0.9), resolved: Math.round(base * 0.75) },
      { name: 'Min', tasks: base, resolved: stats.completedTasks },
    ];
  }, [filteredData, stats.completedTasks]);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan & Analitik</h1>
          <p className="text-slate-500">Analisis kinerja respon bencana dan alokasi sumber daya.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Incident Filter */}
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <select 
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white pl-10 pr-8 text-sm font-medium text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-w-[200px]"
             >
                <option value="all">Semua Insiden</option>
                {incidents.map(inc => (
                    <option key={inc.id} value={inc.id}>{inc.name}</option>
                ))}
             </select>
          </div>

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
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
          <p className="text-sm font-medium text-slate-500">
             {selectedIncidentId === 'all' ? 'Total Insiden Aktif' : 'Tugas Selesai'}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">
                {selectedIncidentId === 'all' ? stats.totalIncidents : stats.completedTasks}
            </h3>
            <span className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                Data Realtime
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-teal-200">
           <p className="text-sm font-medium text-slate-500">Tingkat Penyelesaian</p>
           <div className="mt-2 flex items-baseline gap-2">
             <h3 className="text-3xl font-bold text-slate-900">{stats.completionRate}%</h3>
             <span className="text-sm font-semibold text-teal-600">+12%</span>
           </div>
           <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${stats.completionRate}%` }}></div>
           </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-orange-200">
           <p className="text-sm font-medium text-slate-500">Relawan Terlibat</p>
           <div className="mt-2 flex items-baseline gap-2">
             <h3 className="text-3xl font-bold text-slate-900">{stats.activeVolunteers}</h3>
             <span className="text-sm font-semibold text-orange-600">Personil</span>
           </div>
           <p className="mt-1 text-xs text-slate-400">Di lokasi {selectedIncidentId === 'all' ? 'semua area' : 'terpilih'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-purple-200">
           <p className="text-sm font-medium text-slate-500">Sumber Daya Didistribusikan</p>
           <div className="mt-2 flex items-baseline gap-2">
             <h3 className="text-3xl font-bold text-slate-900">{stats.totalResources.toLocaleString()}</h3>
             <span className="text-sm font-semibold text-purple-600">Unit</span>
           </div>
           <p className="mt-1 text-xs text-slate-400">Total item logistik</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Tren Aktivitas Tugas</h3>
                <p className="text-xs text-slate-500">Perbandingan tugas baru vs tugas selesai (7 hari terakhir)</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                <Area type="monotone" name="Tugas Baru" dataKey="tasks" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
                <Area type="monotone" name="Selesai" dataKey="resolved" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-slate-800">Distribusi Jenis Tugas</h3>
          <div className="h-[300px] w-full">
            {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                    Belum ada data tugas untuk ditampilkan.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
