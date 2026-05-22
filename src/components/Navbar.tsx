import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { ViewType } from '../store/useStore';
import { 
  LayoutDashboard, 
  User, 
  Tag, 
  Mic, 
  CalendarDays, 
  LogOut,
  Users
} from 'lucide-react';
import ipmLogo from '../assets/ipm_logo.png';

export const Navbar: React.FC = () => {
  const { auth, logout, currentView, setView } = useStore();
  const [collapsed] = useState(false);

  const handleLogout = () => {
    window.speechSynthesis.cancel(); // Bersihkan antrean suara
    const msg = new SpeechSynthesisUtterance("Terima kasih telah mengikuti seminar Membangun Karakter Pelajar Berkemajuan bersama Pimpinan Ranting Ikatan Pelajar Muhammadiyah Desa Pesantunan");
    msg.lang = 'id-ID';
    msg.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(v => v.name.toLowerCase().includes('google') && v.lang.includes('id'));
    if (googleVoice) msg.voice = googleVoice;
    window.speechSynthesis.speak(msg);
    logout();
  };

  if (!auth) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const navItems = [
    { view: 'dashboard' as ViewType, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { view: 'biodata' as ViewType, label: 'Biodata Anggota', icon: <User size={20} /> },
    { view: 'pengurus' as ViewType, label: 'Kelola Pengurus', icon: <Users size={20} /> },
    { view: 'categories' as ViewType, label: 'Kategori Event', icon: <Tag size={20} /> },
    { view: 'speakers' as ViewType, label: 'Pembicara / Speaker', icon: <Mic size={20} /> },
    { view: 'events' as ViewType, label: 'Manajemen Event', icon: <CalendarDays size={20} /> },
  ];

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? 72 : 280,
      }}
    >
      <div className="sidebar-header" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div className="logo-icon" style={{ width: 38, height: 38, minWidth: 38, padding: 2, overflow: 'hidden' }}>
          <img src={ipmLogo} alt="IPM Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{
          overflow: 'hidden',
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : 'auto',
          transition: 'opacity 0.2s ease, width 0.3s ease',
          whiteSpace: 'nowrap',
        }}>
          <span className="logo-text">Membangun Karakter Pelajar</span>
          <span className="logo-sub">Berkemajuan</span>
        </div>


      </div>
      
      <nav className="sidebar-menu" style={{ padding: collapsed ? '20px 8px' : '20px 12px' }}>
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`menu-item ${currentView === item.view ? 'active' : ''}`}
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '12px' : '12px 16px',
            }}
            title={collapsed ? item.label : undefined}
          >
            <span style={{ minWidth: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </span>
            <span style={{
              overflow: 'hidden',
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              transition: 'opacity 0.2s ease, width 0.3s ease',
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer" style={{ padding: collapsed ? '12px 8px' : '16px' }}>
        <div
          className="student-info-small"
          style={{
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '8px' : '10px',
          }}
        >
          {auth.photoUrl ? (
            <img 
              src={auth.photoUrl} 
              alt={auth.name} 
              style={{
                width: 36,
                height: 36,
                minWidth: 36,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--border-color)',
              }} 
            />
          ) : (
            <div className="avatar-small">
              {getInitials(auth.name)}
            </div>
          )}
          <div
            className="student-meta"
            style={{
              overflow: 'hidden',
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              transition: 'opacity 0.2s ease, width 0.3s ease',
            }}
          >
            <div className="student-name-small">{auth.name}</div>
            <div className="student-nim-small">Email: {auth.nim}</div>
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={handleLogout}
          style={{
            justifyContent: 'center',
          }}
        >
          <LogOut size={16} />
          <span style={{
            overflow: 'hidden',
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
            transition: 'opacity 0.2s ease, width 0.3s ease',
            whiteSpace: 'nowrap',
          }}>
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
};
export default Navbar;
