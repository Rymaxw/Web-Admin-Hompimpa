
import React from 'react';
import { Plus, MoreHorizontal, Clock, CheckCircle2 } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';
import { TaskStatus } from '../types';
import { useTaskModal } from '../contexts/TaskModalContext';

const Tasks: React.FC = () => {
  const { openTaskForm } = useTaskModal();
  const { tasks } = useTaskContext();

  const columns = [
    { id: TaskStatus.OPEN, title: 'Terbuka', color: 'border-slate-300' },
    { id: TaskStatus.IN_PROGRESS, title: 'Dalam Proses', color: 'border-blue-500' },
    { id: TaskStatus.DONE, title: 'Selesai', color: 'border-teal-500' },
  ];

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Papan Tugas</h1>
        <div className="flex gap-3">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={`https://picsum.photos/seed/${i}/100`} alt=""/>
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white text-xs font-medium text-slate-500">+4</span>
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

      <div className="flex h-full gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.id} className="flex min-w-[320px] max-w-[360px] flex-col rounded-xl bg-slate-100/50 p-4">
            <div className={`mb-4 flex items-center justify-between border-t-4 ${col.color} bg-white px-4 py-3 shadow-sm rounded-lg`}>
              <h3 className="font-bold text-slate-700">{col.title}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1 no-scrollbar">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="group relative flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md cursor-grab active:cursor-grabbing">
                  <div className="flex justify-between items-start">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        task.type === 'Medis' ? 'bg-red-50 text-red-600' : 
                        task.type === 'Logistik' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                        {task.type}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600"><MoreHorizontal size={16}/></button>
                  </div>
                  
                  <h4 className="font-semibold text-slate-800 text-sm leading-snug">{task.title}</h4>
                  
                  <div className="mt-2 flex items-center justify-between border-t border-slate-50 pt-3">
                     <div className="flex items-center gap-2">
                        <img src={task.assigneeAvatar} alt={task.assignee} className="h-6 w-6 rounded-full object-cover" />
                        <span className="text-xs text-slate-500 font-medium">{task.assignee}</span>
                     </div>
                     <div className={`flex items-center gap-1 text-xs font-medium ${task.status === TaskStatus.DONE ? 'text-teal-600' : 'text-slate-400'}`}>
                        {task.status === TaskStatus.DONE ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                        {task.dueDate}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
