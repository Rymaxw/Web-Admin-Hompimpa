import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UserProfile } from '../types';

const defaultProfile: UserProfile = {
  firstName: 'Admin',
  lastName: 'Hompimpa',
  email: 'admin@hompimpa.id',
  phone: '+62 812-3456-7890',
  organization: 'Badan Penanggulangan Bencana',
  timezone: '(GMT+07:00) Jakarta',
  avatar: 'https://picsum.photos/seed/admin/150',
};

interface UserContextType {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
