import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import type { Pengurus } from '../store/useStore';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Users, AlertCircle } from 'lucide-react';

export const ManagePengurus: React.FC = () => {
  const { 
    pengurus, 
    loading, 
    error, 
    fetchPengurus, 
    createPengurus, 
    updatePengurus, 
    deletePengurus 
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPengurus, setEditingPengurus] = useState<Pengurus | null>(null);
  
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchPengurus();
  }, [fetchPengurus]);

  const handleOpenCreate = () => {
    setEditingPengurus(null);
    setNama('');
    setJabatan('');
    setPhotoUrl('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Pengurus) => {
    setEditingPengurus(p);
    setNama(p.nama);
    setJabatan(p.jabatan);
    setPhotoUrl(p.photoUrl || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!nama.trim()) {
      setFormError('Nama Pengurus harus diisi.');
      return;
    }
    if (!jabatan.trim()) {
      setFormError('Jabatan harus diisi.');
      return;
    }

    let success = false;
    if (editingPengurus) {
      success = await updatePengurus(editingPengurus.id, nama, jabatan, photoUrl);
    } else {
      success = await createPengurus(nama, jabatan, photoUrl);
    }

    if (success) {
      setIsModalOpen(false);
      setNama('');
      setJabatan('');
      setPhotoUrl('');
    } else {
      setFormError('Gagal menyimpan pengurus.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengurus ini?')) {
      await deletePengurus(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Jajaran Pengurus</h1>
          <p>Kelola profil pengurus PR IPM Desa Pesantunan.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          Tambah Pengurus
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="glass-card">
        {loading && pengurus.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading pengurus...</div>
        ) : pengurus.length === 0 ? (
          <div className="empty-state">
            <Users />
            <h3>Belum ada Pengurus</h3>
            <p>Klik tombol "Tambah Pengurus" untuk menambahkan profil pengurus pertama Anda.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '50px' }} />
                <col style={{ width: '40%' }} />
                <col style={{ width: '40%' }} />
                <col style={{ width: '100px' }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(107,24,57,0.1)' }}>
                  <th style={{ padding: '14px 12px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>No</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Nama Pengurus</th>
                  <th style={{ padding: '14px 12px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Jabatan</th>
                  <th style={{ padding: '14px 12px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengurus.map((p, idx) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '14px 12px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.9rem' }}>{idx + 1}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.photoUrl ? (
                          <img 
                            src={p.photoUrl} 
                            alt={p.nama} 
                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }} 
                          />
                        ) : (
                          <div style={{ 
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #6b1839, #8b2050)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 600, color: '#fff'
                          }}>
                            {p.nama.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nama}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#5a5a7a', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.jabatan}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button 
                          className="btn-icon edit" 
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Pengurus"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(p.id)}
                          title="Hapus Pengurus"
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPengurus ? 'Edit Profil Pengurus' : 'Tambah Profil Pengurus'}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="alert alert-danger" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5a5a7a', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 12 }}>
              FOTO PROFIL PENGURUS
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Preview" 
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#7a1b41', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>
                  {nama ? nama.substring(0, 2).toUpperCase() : 'FT'}
                </div>
              )}
              <label style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', 
                border: '1px solid #e0e0e0', borderRadius: 8, cursor: 'pointer',
                fontSize: '0.9rem', fontWeight: 500, color: '#1a1a2e', background: '#fff'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                Pilih Foto Galeri
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPhotoUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5a5a7a', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
              NAMA LENGKAP
            </label>
            <input
              type="text"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '0.95rem' }}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Ahmad Fauzan"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5a5a7a', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
              JABATAN
            </label>
            <select
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '0.95rem', backgroundColor: '#fff' }}
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              required
            >
              <option value="" disabled>Pilih Jabatan</option>
              <option value="Ketua Umum">Ketua Umum</option>
              <option value="Sekretaris">Sekretaris</option>
              <option value="Bendahara">Bendahara</option>
              <option value="Bid. Organisasi">Bid. Organisasi</option>
              <option value="Bid. Kaderisasi">Bid. Kaderisasi</option>
              <option value="Bid. Kajian">Bid. Kajian</option>
              <option value="Anggota">Anggota</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 30, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', color: '#1a1a2e', fontWeight: 600, cursor: 'pointer' }}
            >
              Batal
            </button>
            <button 
              type="submit" 
              style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#7a1b41', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
            >
              Simpan Profil
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ManagePengurus;
