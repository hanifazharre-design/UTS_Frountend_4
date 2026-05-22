import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import Modal from '../components/Modal';
import { User, Award, School, Calendar, Mail, Edit3, Camera, AlertCircle, MapPin, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const Biodata: React.FC = () => {
  const { auth, updateProfile } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState(auth?.name || '');
  const [major, setMajor] = useState(auth?.major || '');
  const [classType, setClassType] = useState(auth?.class || '');
  const [generation, setGeneration] = useState(auth?.generation || '');
  const [photoUrl, setPhotoUrl] = useState(auth?.photoUrl || '');
  const [birthPlaceDate, setBirthPlaceDate] = useState(auth?.birthPlaceDate || 'Brebes, 12 Oktober 2005');
  const [formError, setFormError] = useState<string | null>(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  if (!auth) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleOpenEdit = () => {
    setName(auth.name);
    setMajor(auth.major);
    setClassType(auth.class);
    setGeneration(auth.generation);
    setPhotoUrl(auth.photoUrl || '');
    setBirthPlaceDate(auth.birthPlaceDate || 'Brebes, 12 Oktober 2005');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Nama Lengkap tidak boleh kosong.');
      return;
    }
    if (!major.trim()) {
      setFormError('Program Studi tidak boleh kosong.');
      return;
    }
    if (!generation.trim()) {
      setFormError('Tahun Angkatan tidak boleh kosong.');
      return;
    }
    if (!birthPlaceDate.trim()) {
      setFormError('Tempat Tanggal Lahir tidak boleh kosong.');
      return;
    }

    updateProfile({
      name: name.trim(),
      major: major.trim(),
      class: classType,
      generation: generation.trim(),
      photoUrl,
      birthPlaceDate: birthPlaceDate.trim()
    });

    setIsModalOpen(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (!currentPassword) {
      setPwError('Password lama wajib diisi.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('Password baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Konfirmasi password tidak cocok.');
      return;
    }

    // Simulate password change
    setPwSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setPwSuccess(false);
    }, 1500);
  };

  const lightCard: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    padding: 0,
    overflow: 'hidden',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: '#6b1839',
    marginBottom: 6,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#1a1a2e',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const infoRow: React.CSSProperties = {
    padding: '16px 24px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Bio Data Anggota</h1>
          <p>Atur dan perbarui profil anggota Anda secara dinamis.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={() => { setPwError(null); setPwSuccess(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setIsPasswordModalOpen(true); }}
            style={{ background: 'rgba(107,24,57,0.06)', color: '#6b1839', border: '1px solid rgba(107,24,57,0.15)' }}
          >
            <Lock size={16} />
            Ganti Password
          </button>
          <button className="btn btn-primary" onClick={handleOpenEdit}>
            <Edit3 size={18} />
            Edit Profil
          </button>
        </div>
      </div>

      {/* ═══ PROFILE CARD ═══ */}
      <div style={lightCard}>
        {/* Profile Photo - Centered Top */}
        <div style={{
          background: 'linear-gradient(135deg, #6b1839 0%, #8b2050 50%, #a93060 100%)',
          padding: '40px 24px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          <div style={{ position: 'relative' }}>
            {auth.photoUrl ? (
              <img 
                src={auth.photoUrl} 
                alt={auth.name} 
                style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                }} 
              />
            ) : (
              <div style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '4px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: 'white',
                boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                fontFamily: 'var(--font-heading)',
              }}>
                {getInitials(auth.name)}
              </div>
            )}
            {/* Camera badge */}
            <button
              onClick={handleOpenEdit}
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#ffffff',
                border: '2px solid rgba(107,24,57,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              title="Ubah foto profil"
            >
              <Camera size={14} color="#6b1839" />
            </button>
          </div>
          <h2 style={{
            color: 'white',
            fontSize: '1.4rem',
            fontWeight: 700,
            marginTop: 16,
            fontFamily: 'var(--font-heading)',
          }}>{auth.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginTop: 4 }}>
            {auth.major} • NIA: {auth.nim}
          </p>
          <span style={{
            marginTop: 12,
            padding: '4px 16px',
            borderRadius: 20,
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
          }}>
            <ShieldCheck size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Sesi Aktif
          </span>
        </div>

        {/* Info Rows */}
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={infoRow}>
              <div style={labelStyle}>Nama Lengkap</div>
              <div style={valueStyle}>
                <User size={16} color="#6b1839" />
                {auth.name}
              </div>
            </div>
            <div style={{ ...infoRow, borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={labelStyle}>Nomor Induk Anggota (NIA)</div>
              <div style={valueStyle}>
                <Award size={16} color="#8b2050" />
                {auth.nim}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={infoRow}>
              <div style={labelStyle}>Jabatan</div>
              <div style={valueStyle}>
                <School size={16} color="#2e7d32" />
                {auth.major}
              </div>
            </div>
            <div style={{ ...infoRow, borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={labelStyle}>Tempat, Tanggal Lahir</div>
              <div style={valueStyle}>
                <MapPin size={16} color="#d32f2f" />
                {auth.birthPlaceDate || 'Brebes, 12 Oktober 2005'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={infoRow}>
              <div style={labelStyle}>Periode Jabatan</div>
              <div style={valueStyle}>
                <Calendar size={16} color="#7a5a6a" />
                Angkatan {auth.generation}
              </div>
            </div>
            <div style={{ ...infoRow, borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={labelStyle}>Pimpinan Ranting</div>
              <div style={valueStyle}>
                <School size={16} color="#6b1839" />
                IPM Pesantunan
              </div>
            </div>
          </div>

          <div style={{ ...infoRow, borderBottom: 'none', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(107,24,57,0.02)' }}>
            <Mail size={18} color="#6b1839" />
            <div>
              <p style={{ fontSize: '0.78rem', color: '#7a5a6a', fontWeight: 500 }}>Email Aktif</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a2e' }}>{auth.email || auth.nim}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Perbarui Biodata Anggota"
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="alert alert-danger" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <label className="form-label" style={{ alignSelf: 'flex-start' }}>Foto Profil Anggota</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', marginTop: 8 }}>
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Preview" 
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
                />
              ) : (
                <div 
                  style={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  {getInitials(name || auth.name)}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  id="student-photo-input"
                  className="form-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', padding: '8px 16px' }}
                  onClick={() => document.getElementById('student-photo-input')?.click()}
                >
                  <Camera size={14} />
                  Pilih Foto Galeri
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor Induk Anggota (NIA) (Tidak Dapat Diubah)</label>
            <input
              type="text"
              className="form-input"
              value={auth.nim}
              disabled
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Jabatan</label>
              <select
                className="form-input"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
              >
                <option value="Ketua Umum">Ketua Umum</option>
                <option value="Sekretaris Umum">Sekretaris Umum</option>
                <option value="Ketua Bidang Asbo">Ketua Bidang Asbo</option>
                <option value="Ketua Bidang KWU">Ketua Bidang KWU</option>
                <option value="Ketua Bidang KDI">Ketua Bidang KDI</option>
                <option value="Sekertaris Bidang Asbo">Sekertaris Bidang Asbo</option>
                <option value="Sekertaris Bidang KWU">Sekertaris Bidang KWU</option>
                <option value="Sekertaris Bidang KDI">Sekertaris Bidang KDI</option>
                <option value="Anggota Umum Bidang Asbo">Anggota Umum Bidang Asbo</option>
                <option value="Anggota Umum KWU">Anggota Umum KWU</option>
                <option value="Anggota Umum KDI">Anggota Umum KDI</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Tempat, Tanggal Lahir</label>
              <input
                type="text"
                className="form-input"
                value={birthPlaceDate}
                onChange={(e) => setBirthPlaceDate(e.target.value)}
                placeholder="Contoh: Brebes, 15 Agustus 2004"
                required
              />
            </div>
            <div>
              <label className="form-label">Tahun Angkatan</label>
              <input
                type="text"
                className="form-input"
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
                placeholder="Contoh: 2022"
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Profil
            </button>
          </div>
        </form>
      </Modal>

      {/* ═══ GANTI PASSWORD MODAL ═══ */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Ganti Password"
      >
        <form onSubmit={handlePasswordChange}>
          {pwError && (
            <div className="alert alert-danger" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>{pwError}</span>
            </div>
          )}
          {pwSuccess && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(46, 125, 50, 0.1)',
              border: '1px solid rgba(46, 125, 50, 0.3)',
              color: '#2e7d32',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}>
              <ShieldCheck size={16} />
              Password berhasil diubah!
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password Lama</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPw ? 'text' : 'password'}
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password lama"
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
                }}
              >
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password Baru</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPw ? 'text' : 'password'}
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
                }}
              >
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Konfirmasi Password Baru</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPw ? 'text' : 'password'}
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
                }}
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsPasswordModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={16} />
              Ubah Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Biodata;
