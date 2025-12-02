
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Tasks from './pages/Tasks';
import Volunteers from './pages/Volunteers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { TaskModalProvider } from './contexts/TaskModalContext';
import { TaskProvider } from './contexts/TaskContext';
import { IncidentProvider } from './contexts/IncidentContext';
import { VolunteerProvider } from './contexts/VolunteerContext';

const App: React.FC = () => {
  return (
    <IncidentProvider>
      <TaskProvider>
        <VolunteerProvider>
            <TaskModalProvider>
              <HashRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="insidents" element={<Incidents />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="volunteers" element={<Volunteers />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </HashRouter>
            </TaskModalProvider>
        </VolunteerProvider>
      </TaskProvider>
    </IncidentProvider>
  );
};

export default App;
