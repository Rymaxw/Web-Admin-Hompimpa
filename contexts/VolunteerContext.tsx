
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Volunteer } from '../types';
import { volunteers as initialVolunteers } from '../mockData';

interface VolunteerContextType {
  volunteers: Volunteer[];
  addVolunteer: (volunteer: Volunteer) => void;
  updateVolunteer: (volunteer: Volunteer) => void;
  deleteVolunteer: (id: string) => void;
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined);

export const VolunteerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);

  const addVolunteer = (volunteer: Volunteer) => {
    setVolunteers((prev) => [volunteer, ...prev]);
  };

  const updateVolunteer = (updatedVolunteer: Volunteer) => {
    setVolunteers((prev) => prev.map((vol) => (vol.id === updatedVolunteer.id ? updatedVolunteer : vol)));
  };

  const deleteVolunteer = (id: string) => {
    setVolunteers((prev) => prev.filter((vol) => vol.id !== id));
  };

  return (
    <VolunteerContext.Provider value={{ volunteers, addVolunteer, updateVolunteer, deleteVolunteer }}>
      {children}
    </VolunteerContext.Provider>
  );
};

export const useVolunteerContext = () => {
  const context = useContext(VolunteerContext);
  if (!context) {
    throw new Error('useVolunteerContext must be used within a VolunteerProvider');
  }
  return context;
};
