import React from 'react';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Biodata from './pages/Biodata';
import ManageCategories from './pages/ManageCategories';
import ManageSpeakers from './pages/ManageSpeakers';
import ManageEvents from './pages/ManageEvents';
import ManagePengurus from './pages/ManagePengurus';
import Landing from './pages/Landing';

export const App: React.FC = () => {
  const { auth, currentView } = useStore();

  // Public layouts (no sidebar)
  if (currentView === 'landing') {
    return <Landing />;
  }

  if (currentView === 'login' || !auth) {
    return <Login />;
  }

  // Render the dashboard shell for authenticated users
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'biodata' && <Biodata />}
        
        {currentView === 'categories' && (
          <ProtectedRoute>
            <ManageCategories />
          </ProtectedRoute>
        )}
        
        {currentView === 'speakers' && (
          <ProtectedRoute>
            <ManageSpeakers />
          </ProtectedRoute>
        )}
        
        {currentView === 'events' && (
          <ProtectedRoute>
            <ManageEvents />
          </ProtectedRoute>
        )}
        
        {currentView === 'pengurus' && (
          <ProtectedRoute>
            <ManagePengurus />
          </ProtectedRoute>
        )}
      </main>
    </div>
  );
};

export default App;
