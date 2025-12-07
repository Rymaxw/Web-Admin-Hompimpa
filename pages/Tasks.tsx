
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, MoreHorizontal, Clock, CheckCircle2, ChevronLeft, LayoutGrid, List, Filter, Check, ArrowRight, AlertTriangle, Eye, Edit2 } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';
import { useIncidentContext } from '../contexts/IncidentContext';
import { TaskStatus, IncidentSeverity, Task } from '../types';
import { useTaskModal } from '../contexts/TaskModalContext';
import TaskDetailModal from '../components/TaskDetailModal';

const Tasks: React.FC = () => {
  const { openTaskForm, openEditTaskForm } = useTaskModal();
  const { tasks } = useTaskContext();
  const { incidents } = useIncidentContext();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  
  // State for Master-Detail View
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State for Dropdown Actions
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // State for View Detail Modal
  const [viewTask, setViewTask] = useState<Task | null>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // --- Derived Data ---

  // Get current selected incident details
  const currentIncident = useMemo(() => 
    incidents.find(i => i.id === selectedIncidentId), 
  [selectedIncidentId, incidents]);

  // Filter tasks for the selected incident
  const incidentTasks = useMemo(() => {
    if (!selectedIncidentId) return [];
    let filtered = tasks.filter(t => t.incidentId === selectedIncidentId);
    
    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.assignee.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }
    
    return filtered;
  }, [tasks, selectedIncidentId, priorityFilter]);

  // Calculate stats for the Overview Cards
  const incidentStats = useMemo(() => {
    return incidents.map(inc => {
      const incTasks = tasks.filter(t => t.incidentId === inc.id);
      const doneCount = incTasks.filter(t => t.status === TaskStatus.DONE).length;
      return {
        ...inc,
        totalTasks: incTasks.length,
        open: incTasks.filter(t => t.status === TaskStatus.OPEN).length,
        inProgress: incTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
        done: doneCount,
        progress: incTasks.length > 0 
          ? Math.round((doneCount / incTasks.length) * 100) 
          : 0
      };
    });
  }, [incidents, tasks]);

  // Kanban Columns
  const columns = [
    { id: TaskStatus.OPEN, title: 'Terbuka', color: 'border-slate-300', bg: 'bg-slate-50' },
    { id: TaskStatus.IN_PROGRESS, title: 'Dalam Proses', color: 'border-blue-500', bg: 'bg-blue-50' },
    { id: TaskStatus.DONE, title: 'Selesai', color: 'border-teal-500', bg: 'bg-teal-50' },
  ];

  const handleDropdownClick = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === taskId ? null : taskId);
  };

  const handleEditTask = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    openEditTaskForm(task);
    setActiveDropdownId(null);
  };

  const handleViewTask = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setViewTask(task);
    setActiveDropdownId(null);
  };

  // --- Render Views ---

  // 1. DETAIL VIEW: Kanban Board for specific Incident
  if (selectedIncidentId && currentIncident) {
    return (
      <div className="flex h-[calc(100vh-140px)] flex-col gap-6">
        {/* Header Navigation */}
        <div className="flex flex-col gap-4">
            <button 
                onClick={() => setSelectedIncidentId(null)}
                className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary w-fit transition-colors"
            >
                <ChevronLeft size={16} />
                Kembali ke Daftar Insiden
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        {currentIncident.name}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                             currentIncident.severity === IncidentSeverity.CRITICAL ? 'bg-red-100 text-red-700' : 
                             currentIncident.severity === IncidentSeverity.HIGH ? 'bg-orange-100 text-orange-700' : 
                             'bg-teal-100 text-teal-700'
                        }`}>
                            {currentIncident.severity}
                        </span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">{currentIncident.location}</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Priority Filter */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                priorityFilter !== 'All' 
                                ? 'border-primary bg-sky-50 text-primary' 
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Filter size={16} />
                            {priorityFilter === 'All' ? 'Filter Prioritas' : priorityFilter}
                        </button>
                        {isFilterOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-lg z-20 overflow-hidden">
                                <button onClick={() => { setPriorityFilter('All'); setIsFilterOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Semua {priorityFilter === 'All' && <Check size={14} className="text-primary"/>}</button>
                                <button onClick={() => { setPriorityFilter('High'); setIsFilterOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Tinggi/Kritis {priorityFilter === 'High' && <Check size={14} className="text-primary"/>}</button>
                                <button onClick={() => { setPriorityFilter('Medium'); setIsFilterOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Sedang {priorityFilter === 'Medium' && <Check size={14} className="text-primary"/>}</button>
                                <button onClick={() => { setPriorityFilter('Low'); setIsFilterOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Rendah {priorityFilter === 'Low' && <Check size={14} className="text-primary"/>}</button>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={openTaskForm}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow hover:bg-sky-600"
                    >
                        <Plus size={18} />
                        Buat Tugas
                    </button>
                </div>
            </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-x-auto pb-4">
            {columns.map(col => {
                const colTasks = incidentTasks.filter(t => t.status === col.id);
                
                return (
                    <div key={col.id} className="flex flex-col h-full bg-slate-100 rounded-xl p-4 border border-slate-200/60">
                         <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${col.color}`}>
                            <h3 className="font-bold text-slate-700">{col.title}</h3>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                                {colTasks.length}
                            </span>
                         </div>

                         <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
                            {colTasks.length > 0 ? (
                                colTasks.map(task => (
                                    <div 
                                        key={task.id} 
                                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer relative"
                                        onClick={(e) => handleViewTask(e, task)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                                task.priority === 'Medium' ? 'bg-orange-50 text-orange-600' :
                                                'bg-teal-50 text-teal-600'
                                            }`}>
                                                {task.priority === 'High' ? 'Tinggi/Kritis' : task.priority === 'Medium' ? 'Sedang' : 'Rendah'}
                                            </span>
                                            
                                            {/* Three Dots Button */}
                                            <div className="relative">
                                                <button 
                                                    className="text-slate-400 hover:text-primary p-1 rounded-full hover:bg-slate-50"
                                                    onClick={(e) => handleDropdownClick(e, task.id)}
                                                >
                                                    <MoreHorizontal size={16}/>
                                                </button>
                                                
                                                {/* Action Dropdown */}
                                                {activeDropdownId === task.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
                                                        <button 
                                                            onClick={(e) => handleViewTask(e, task)}
                                                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                                        >
                                                            <Eye size={14}/> Detail
                                                        </button>
                                                        <button 
                                                            onClick={(e) => handleEditTask(e, task)}
                                                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 border-t border-slate-100"
                                                        >
                                                            <Edit2 size={14}/> Edit
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="font-semibold text-slate-800 text-sm mb-3 line-clamp-2">{task.title}</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img src={task.assigneeAvatar} alt={task.assignee} className="w-6 h-6 rounded-full object-cover border border-slate-100" />
                                                <span className="text-xs text-slate-500">{task.assignee}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Clock size={12} />
                                                <span className="text-[10px] font-medium">{task.dueDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                                    Tidak ada tugas
                                </div>
                            )}
                         </div>
                    </div>
                );
            })}
        </div>
        
        {/* Task Detail View Modal */}
        <TaskDetailModal 
            isOpen={!!viewTask} 
            onClose={() => setViewTask(null)} 
            task={viewTask}
        />
      </div>
    );
  }

  // 2. MASTER VIEW: List of Incident Groups
  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Manajemen Tugas</h1>
                <p className="text-slate-500 mt-1">Pilih insiden untuk mengelola tugas terkait.</p>
            </div>
            <button 
                onClick={openTaskForm}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-sky-600 transition-colors"
            >
                <Plus size={18} />
                Buat Tugas Baru
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {incidentStats.map(inc => (
                <div 
                    key={inc.id} 
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className="group relative bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">{inc.name}</h3>
                            <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                                <AlertTriangle size={14} />
                                {inc.location}
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                             inc.severity === IncidentSeverity.CRITICAL ? 'bg-red-100 text-red-700' : 
                             inc.severity === IncidentSeverity.HIGH ? 'bg-orange-100 text-orange-700' : 
                             'bg-teal-100 text-teal-700'
                        }`}>
                            {inc.severity}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                            <span>Progres Penanganan</span>
                            <span>{inc.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-primary h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${inc.progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                            <span className="block text-lg font-bold text-slate-700">{inc.open}</span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase">Terbuka</span>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                            <span className="block text-lg font-bold text-blue-700">{inc.inProgress}</span>
                            <span className="text-[10px] text-blue-600 font-medium uppercase">Proses</span>
                        </div>
                        <div className="bg-teal-50 rounded-lg p-2 border border-teal-100">
                            <span className="block text-lg font-bold text-teal-700">{inc.done}</span>
                            <span className="text-[10px] text-teal-600 font-medium uppercase">Selesai</span>
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                        <div className="flex -space-x-2">
                            {[...Array(Math.min(3, inc.totalTasks))].map((_, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                            {inc.totalTasks > 3 && (
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    +{inc.totalTasks - 3}
                                </div>
                            )}
                        </div>
                        <span className="flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
                            Lihat Detail <ArrowRight size={16} />
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Tasks;
