
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Task } from '../types';

interface TaskModalContextType {
  isOpen: boolean;
  taskToEdit: Task | null;
  openTaskForm: () => void;
  openEditTaskForm: (task: Task) => void;
  closeTaskForm: () => void;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export const TaskModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const openTaskForm = () => {
    setTaskToEdit(null);
    setIsOpen(true);
  };

  const openEditTaskForm = (task: Task) => {
    setTaskToEdit(task);
    setIsOpen(true);
  };

  const closeTaskForm = () => {
    setIsOpen(false);
    // Delay clearing taskToEdit to avoid UI flickering during closing transition
    setTimeout(() => setTaskToEdit(null), 300);
  };

  return (
    <TaskModalContext.Provider value={{ isOpen, taskToEdit, openTaskForm, openEditTaskForm, closeTaskForm }}>
      {children}
    </TaskModalContext.Provider>
  );
};

export const useTaskModal = () => {
  const context = useContext(TaskModalContext);
  if (!context) {
    throw new Error('useTaskModal must be used within a TaskModalProvider');
  }
  return context;
};
