
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Incident } from '../types';
import { incidents as initialIncidents } from '../mockData';

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (incident: Incident) => void;
  updateIncident: (incident: Incident) => void;
  deleteIncident: (id: string) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  const addIncident = (incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
  };

  const updateIncident = (updatedIncident: Incident) => {
    setIncidents((prev) => prev.map((inc) => (inc.id === updatedIncident.id ? updatedIncident : inc)));
  };

  const deleteIncident = (id: string) => {
    setIncidents((prev) => prev.filter((inc) => inc.id !== id));
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident, updateIncident, deleteIncident }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidentContext = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidentContext must be used within an IncidentProvider');
  }
  return context;
};
