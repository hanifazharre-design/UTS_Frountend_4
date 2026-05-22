import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { TabType } from '../store/useStore';
import { AlertCircle, ArrowRight, UserPlus, Eye, EyeOff, User } from 'lucide-react';
import ipmLogo from '../assets/ipm_logo.png';

export const Login: React.FC = () => {
  const { login, register, setView, setLandingTab } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [nim, setNim] = useState(''); // Email
  const [nimReg, setNimReg] = useState(''); // NIM for Register
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [showNim, setShowNim] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nimInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nimInputRef.current?.focus();
    // Memuat data suara (voices) lebih awal agar siap saat tombol ditekan
    window.speechSynthesis.getVoices();
  }, [isRegister]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nim.trim()) {
      setError('Email wajib diisi.');
      return;
    }
    if (isRegister) {
      if (!name.trim()) {
        setError('Nama Lengkap wajib diisi.');
        return;
      }
      if (!nimReg.trim()) {
        setError('Nomor Induk Anggota / NIM wajib diisi.');
        return;
      }
    }
    if (!username.trim()) {
      setError('Kata Sandi wajib diisi.');
      return;
    }
    // Email/NIM validation removed to allow both formats.

    const speakWelcome = () => {
      window.speechSynthesis.cancel(); // Hentikan suara sebelumnya (jika ada) agar langsung responsif
      const msg = new SpeechSynthesisUtterance("SELAMAT DATANG DI SEMINAR, Membangun Karakter Pelajar Berkemajuan, BERSAMA PIMPINAN RANTING IKATAN PELAJAR MUHAMMADIYAH, DESA PESANTUNAN");
      msg.lang = 'id-ID';
      msg.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const googleVoice = voices.find(v => v.name.toLowerCase().includes('google') && v.lang.includes('id'));
      if (googleVoice) msg.voice = googleVoice;
      window.speechSynthesis.speak(msg);
    };

    const speakError = () => {
      window.speechSynthesis.cancel(); // Hentikan suara sebelumnya (jika ada)
      const msg = new SpeechSynthesisUtterance("Login gagal, silakan periksa kembali email dan kata sandi Anda.");
      msg.lang = 'id-ID';
      msg.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const googleVoice = voices.find(v => v.name.toLowerCase().includes('google') && v.lang.includes('id'));
      if (googleVoice) msg.voice = googleVoice;
      window.speechSynthesis.speak(msg);
    };

    if (isRegister) {
      const res = register(nimReg, name, nim, username);
      if (!res.success) {
        setError(res.message || 'Gagal membuat akun.');
      } else {
        speakWelcome();
      }
    } else {
      const res = login(nim, username);
      if (!res.success) {
        setError(res.message || 'Login gagal.');
        speakError();
      } else {
        speakWelcome();
      }
    }
  };

  const navItems = [
    {
      id: 'beranda', label: 'Beranda',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    {
      id: 'competition', label: 'Competition',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    },
    {
      id: 'seminar', label: 'Seminar',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      id: 'workshop', label: 'Workshop',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    },
    {
      id: 'talkshow', label: 'Talkshow',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    },
  ];

  return (
    <div className="landing-page" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: '#ffffff',
      fontFamily: 'var(--font-body)',
    }}>
      {/* ═══ NAVBAR ═══ */}
      <header className="landing-navbar">
        <div className="landing-navbar-inner">
          <div className="landing-logo" style={{ cursor: 'pointer' }} onClick={() => { setLandingTab('beranda'); setView('landing'); }}>
            <img src={ipmLogo} alt="IPM Logo" className="landing-logo-img" />
            <span className="landing-logo-text">Membangun Karakter Pelajar<br/>Berkemajuan</span>
          </div>

          <nav className="landing-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className="landing-nav-link"
                onClick={() => {
                  setLandingTab(item.id as TabType);
                  setView('landing');
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button className="landing-login-btn active" style={{ background: 'var(--landing-primary)', color: '#fff' }} onClick={() => {}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '80px',
        flexWrap: 'wrap-reverse',
        width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '60px 40px',
        flex: 1,
      }}>
        
        {/* ═══ LEFT SIDE: LOGO & TEXT ═══ */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
          textAlign: 'center',
        }}>
          {/* IPM Logo */}
          <div style={{ width: 140, height: 140, marginBottom: 24 }}>
            <img 
              src={ipmLogo} 
              alt="IPM Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Title Text */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.2rem',
            fontWeight: 700,
            color: '#1a1a2e',
            marginBottom: 8,
            letterSpacing: '-0.01em',
          }}>
            Ikatan Pelajar Muhammadiyah
          </h1>
          <p style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'rgba(0,0,0,0.5)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            Pimpinan Ranting Desa Pesantunan
          </p>
        </div>

        {/* ═══ RIGHT SIDE: FORM CARD ═══ */}
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
          padding: '36px 32px 32px',
          position: 'relative',
          zIndex: 2,
          animation: 'fadeInUp 0.5s ease-out',
        }}>
        {/* Tab Header */}
        {!isRegister ? (
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1a1a2e',
            marginBottom: 24,
            textAlign: 'center',
          }}>
            Masuk ke Portal IPM
          </h2>
        ) : (
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1a1a2e',
            marginBottom: 24,
            textAlign: 'center',
          }}>
            Buat Akun Baru
          </h2>
        )}

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(211, 47, 47, 0.07)',
            border: '1px solid rgba(211, 47, 47, 0.15)',
            color: '#d32f2f',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Field (Register only) */}
          {isRegister && (
            <div style={{ marginBottom: 18, animation: 'fadeIn 0.3s ease-out' }}>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: '#333',
                marginBottom: 8,
              }}>
                Nama Lengkap
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '13px 44px 13px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 12,
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    color: '#1a1a2e',
                    background: '#fff',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0d3b4f'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <div style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  color: '#bbb', display: 'flex', pointerEvents: 'none',
                }}>
                  <User size={18} />
                </div>
              </div>
            </div>
          )}

          {/* NIM Field (Register only) */}
          {isRegister && (
            <div style={{ marginBottom: 18, animation: 'fadeIn 0.3s ease-out' }}>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: '#333',
                marginBottom: 8,
              }}>
                Nomor Induk Anggota / NIM
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Masukkan Nomor Induk Anggota"
                  value={nimReg}
                  onChange={(e) => setNimReg(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '13px 44px 13px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 12,
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    color: '#1a1a2e',
                    background: '#fff',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0d3b4f'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <div style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  color: '#bbb', display: 'flex', pointerEvents: 'none',
                }}>
                  <User size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Email Field (formerly NIA) */}
          <div style={{ marginBottom: 18 }}>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 500,
              color: '#333',
              marginBottom: 8,
            }}>
              Nomor Induk Anggota (NIA) / Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={nimInputRef}
                type="text"
                placeholder="Masukkan NIA atau Email Anda"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '13px 44px 13px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 12,
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  color: '#1a1a2e',
                  background: '#fff',
                  transition: 'border-color 0.2s ease',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0d3b4f'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <div style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                color: '#bbb', display: 'flex', pointerEvents: 'none',
              }}>
                <User size={18} />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 18 }}>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 500,
              color: '#333',
              marginBottom: 8,
            }}>
              Kata Sandi
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNim ? "text" : "password"}
                placeholder="Masukkan kata sandi Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '13px 44px 13px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 12,
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  color: '#1a1a2e',
                  background: '#fff',
                  transition: 'border-color 0.2s ease',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0d3b4f'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <button
                type="button"
                onClick={() => setShowNim(!showNim)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                }}
              >
                {showNim ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          {!isRegister && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, marginTop: 4 }}>
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  accentColor: '#0d3b4f',
                  cursor: 'pointer',
                }}
              />
              <label htmlFor="remember-me" style={{ fontSize: '0.85rem', color: '#555', cursor: 'pointer' }}>
                Ingat Saya
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px 20px',
              background: '#0e7a5c',
              color: '#ffffff',
              border: 'none',
              borderRadius: 14,
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(13, 59, 79, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(13, 59, 79, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(13, 59, 79, 0.3)';
            }}
          >
            {isRegister ? (
              <>DAFTAR AKUN <UserPlus size={16} /></>
            ) : (
              <>LOGIN <ArrowRight size={16} /></>
            )}
          </button>

          {/* Separator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '20px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
            <span style={{ fontSize: '0.78rem', color: '#999', fontWeight: 500 }}>Atau</span>
            <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
          </div>

          {/* Toggle Register / Login */}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            style={{
              width: '100%',
              padding: '13px 20px',
              background: '#ffffff',
              color: '#0d3b4f',
              border: '2px solid #e0e0e0',
              borderRadius: 14,
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0d3b4f';
              e.currentTarget.style.background = 'rgba(13, 59, 79, 0.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            {isRegister ? (
              <>Sudah punya akun? Log Masuk</>
            ) : (
              <><UserPlus size={16} /> Buat Akun Baru</>
            )}
          </button>
        </form>
        </div>



      </div>
    </div>
  );
};
export default Login;
