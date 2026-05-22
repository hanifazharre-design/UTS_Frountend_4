import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import type { Speaker } from '../store/useStore';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Users, AlertCircle } from 'lucide-react';

export const ManageSpeakers: React.FC = () => {
  const { 
    speakers, 
    loading, 
    error, 
    fetchSpeakers, 
    createSpeaker, 
    updateSpeaker, 
    deleteSpeaker 
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [biodata, setBiodata] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  const handleOpenCreate = () => {
    setEditingSpeaker(null);
    setName('');
    setEmail('');
    setBiodata('');
    setPhotoUrl('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setName(speaker.name);
    setEmail(speaker.email);
    setBiodata(speaker.biodata);
    setPhotoUrl(speaker.photoUrl || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Nama Pembicara harus diisi.');
      return;
    }
    if (!email.trim()) {
      setFormError('Email Pembicara harus diisi.');
      return;
    }
    if (!biodata.trim()) {
      setFormError('Biodata Pembicara harus diisi.');
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Format email tidak valid.');
      return;
    }

    let success = false;
    if (editingSpeaker) {
      success = await updateSpeaker(editingSpeaker.id, name, biodata, email, photoUrl);
    } else {
      success = await createSpeaker(name, biodata, email, photoUrl);
    }

    if (success) {
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setBiodata('');
      setPhotoUrl('');
    } else {
      setFormError('Gagal menyimpan pembicara. Pastikan email belum pernah digunakan.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pembicara ini? Semua event yang dijadwalkan dengan pembicara ini juga akan terhapus.')) {
      await deleteSpeaker(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Pembicara / Speaker</h1>
          <p>Kelola profil narasumber yang akan mengisi materi di seminar IPM.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          Tambah Pembicara
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="glass-card">
        {loading && speakers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading speakers...</div>
        ) : speakers.length === 0 ? (
          <div className="empty-state">
            <Users />
            <h3>Belum ada Pembicara</h3>
            <p>Klik tombol "Tambah Pembicara" untuk menambahkan profil narasumber pertama Anda.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '50px' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '100px' }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(107,24,57,0.1)' }}>
                  <th style={{ padding: '14px 12px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>No</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Nama Pembicara</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Email</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Biodata Singkat</th>
                  <th style={{ padding: '14px 12px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Event Diisi</th>
                  <th style={{ padding: '14px 12px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {speakers.map((sp, idx) => (
                  <tr key={sp.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '14px 12px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.9rem' }}>{idx + 1}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {sp.photoUrl ? (
                          <img 
                            src={sp.photoUrl} 
                            alt={sp.name} 
                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }} 
                          />
                        ) : (
                          <div style={{ 
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #6b1839, #8b2050)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 600, color: '#fff'
                          }}>
                            {sp.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sp.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#5a5a7a', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sp.email}</td>
                    <td style={{ padding: '14px 12px', color: '#5a5a7a', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sp.biodata}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span className="badge badge-secondary">
                        {sp._count?.events || 0} Event
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button 
                          className="btn-icon edit" 
                          onClick={() => handleOpenEdit(sp)}
                          title="Edit Pembicara"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(sp.id)}
                          title="Hapus Pembicara"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSpeaker ? 'Edit Profil Pembicara' : 'Tambah Profil Pembicara'}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="alert alert-danger" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Prof. Dr. Budi Santoso"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Pembicara</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: budis@ipm.ac.id"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Foto Pembicara (Opsional)</label>
            <input
              type="file"
              className="form-input"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPhotoUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {photoUrl && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <img 
                  src={photoUrl} 
                  alt="Preview" 
                  style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pratinjau Foto Terpilih</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Biodata / Riwayat Singkat</label>
            <textarea
              className="form-input"
              value={biodata}
              onChange={(e) => setBiodata(e.target.value)}
              placeholder="Jelaskan latar belakang akademis, keahlian narasumber..."
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSpeaker ? 'Simpan Perubahan' : 'Tambah Pembicara'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ManageSpeakers;
