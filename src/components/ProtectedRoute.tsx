import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { auth, setView } = useStore();

  useEffect(() => {
    if (!auth) {
      setView('login');
    }
  }, [auth, setView]);

  if (!auth) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        color: '#94a3b8' 
      }}>
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
};
export default ProtectedRoute;
