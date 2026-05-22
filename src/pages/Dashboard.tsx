import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { CalendarDays, Mic, Tag, ArrowRight, Clock, MapPin, TrendingUp, Activity, Zap, Users } from 'lucide-react';

/* Animated Counter Hook */
function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

export const Dashboard: React.FC = () => {
  const {
    auth,
    categories,
    speakers,
    events,
    fetchCategories,
    fetchSpeakers,
    fetchEvents,
    fetchPengurus,
    setView
  } = useStore();

  useEffect(() => {
    fetchCategories();
    fetchSpeakers();
    fetchEvents();
    fetchPengurus();
  }, [fetchCategories, fetchSpeakers, fetchEvents, fetchPengurus]);

  const eventCount = useCounter(events.length);
  const speakerCount = useCounter(speakers.length);
  const categoryCount = useCounter(categories.length);

  const greeting = getGreeting();

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>{greeting}, {auth?.name}!</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={15} style={{ color: 'var(--success)' }} />
            Portal Utama Sistem Informasi Seminar IPM Pesantunan
          </p>
        </div>
        <div className="badge badge-primary" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
          <Zap size={13} />
          Online
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon blue">
            <CalendarDays size={24} />
          </div>
          <div>
            <div className="metric-val">{eventCount}</div>
            <div className="metric-lbl">Total Event</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon purple">
            <Mic size={24} />
          </div>
          <div>
            <div className="metric-val">{speakerCount}</div>
            <div className="metric-lbl">Pembicara</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon green">
            <Tag size={24} />
          </div>
          <div>
            <div className="metric-val">{categoryCount}</div>
            <div className="metric-lbl">Kategori</div>
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Quick Actions */}
        <div className="glass-card">
          <h2 style={{
            marginBottom: 20,
            fontSize: '1.2rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
            Pintasan Cepat
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { view: 'events' as const, label: 'Kelola Seluruh Event', icon: <CalendarDays size={18} />, color: 'var(--primary)' },
              { view: 'speakers' as const, label: 'Kelola Daftar Pembicara', icon: <Mic size={18} />, color: 'var(--secondary)' },
              { view: 'categories' as const, label: 'Kelola Kategori Event', icon: <Tag size={18} />, color: 'var(--success)' },
              { view: 'pengurus' as const, label: 'Kelola Jajaran Pengurus', icon: <Users size={18} />, color: 'var(--warning)' },
            ].map((action) => (
              <button
                key={action.view}
                onClick={() => setView(action.view)}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: action.color }}>{action.icon}</span>
                  {action.label}
                </span>
                <ArrowRight size={16} style={{ opacity: 0.5 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="glass-card">
          <h2 style={{
            marginBottom: 20,
            fontSize: '1.2rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <Zap size={20} style={{ color: 'var(--warning)' }} />
            Event Terbaru
          </h2>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              Belum ada event terdaftar.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 16,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'var(--transition)',
                    cursor: 'default',
                  }}
                >
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: 8,
                    color: 'var(--text-primary)',
                  }}>
                    {event.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock size={13} style={{ color: 'var(--secondary)' }} />
                      {event.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin size={13} style={{ color: 'var(--success)' }} />
                      {event.location}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                      {event.category.name}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Pembicara: <strong style={{ color: 'var(--text-primary)' }}>{event.pembicara.name}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
