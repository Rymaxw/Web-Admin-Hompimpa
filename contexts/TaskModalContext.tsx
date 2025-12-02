
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TaskModalContextType {
  isOpen: boolean;
  openTaskForm: () => void;
  closeTaskForm: () => void;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export const TaskModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openTaskForm = () => setIsOpen(true);
  const closeTaskForm = () => setIsOpen(false);

  return (
    <TaskModalContext.Provider value={{ isOpen, openTaskForm, closeTaskForm }}>
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
