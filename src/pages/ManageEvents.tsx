import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import type { Event } from '../store/useStore';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';

export const ManageEvents: React.FC = () => {
  const { 
    events, 
    categories, 
    speakers, 
    loading, 
    error, 
    fetchEvents, 
    fetchCategories, 
    fetchSpeakers, 
    createEvent, 
    updateEvent, 
    deleteEvent 
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [pembicaraId, setPembicaraId] = useState<number | string>('');
  const [maxParticipants, setMaxParticipants] = useState<number>(100);
  
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchSpeakers();
  }, [fetchEvents, fetchCategories, fetchSpeakers]);

  const handleOpenCreate = () => {
    if (categories.length === 0) {
      alert('Silakan buat Kategori terlebih dahulu sebelum menambahkan Event.');
      return;
    }
    if (speakers.length === 0) {
      alert('Silakan buat Pembicara terlebih dahulu sebelum menambahkan Event.');
      return;
    }
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setCategoryId(categories[0]?.id || '');
    setPembicaraId(speakers[0]?.id || '');
    setMaxParticipants(100);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setLocation(event.location);
    setCategoryId(event.categoryId);
    setPembicaraId(event.pembicaraId);
    setMaxParticipants(event.maxParticipants);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Judul Event harus diisi.');
      return;
    }
    if (!description.trim()) {
      setFormError('Deskripsi Event harus diisi.');
      return;
    }
    if (!date.trim()) {
      setFormError('Tanggal Event harus diisi.');
      return;
    }
    if (!location.trim()) {
      setFormError('Lokasi Event harus diisi.');
      return;
    }
    if (!categoryId) {
      setFormError('Kategori wajib dipilih.');
      return;
    }
    if (!pembicaraId) {
      setFormError('Pembicara wajib dipilih.');
      return;
    }

    const eventData = {
      title,
      description,
      date,
      location,
      categoryId: Number(categoryId),
      pembicaraId: Number(pembicaraId),
      maxParticipants: Number(maxParticipants) || 100
    };

    let success = false;
    if (editingEvent) {
      success = await updateEvent(editingEvent.id, eventData);
    } else {
      success = await createEvent(eventData);
    }

    if (success) {
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setCategoryId('');
      setPembicaraId('');
      setMaxParticipants(100);
    } else {
      setFormError('Gagal menyimpan event. Periksa kembali validitas data.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini secara permanen?')) {
      await deleteEvent(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Manajemen Event</h1>
          <p>Kelola jadwal, deskripsi, lokasi, kuota, serta pembicara seminar IPM Pesantunan.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          Buat Event Baru
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="glass-card">
        {loading && events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <Calendar />
            <h3>Belum ada Event Terjadwal</h3>
            <p>Klik tombol "Buat Event Baru" untuk memublikasikan informasi seminar pertama Anda.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '40px' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '65px' }} />
                <col style={{ width: '85px' }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(107,24,57,0.1)' }}>
                  <th style={{ padding: '14px 10px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>No</th>
                  <th style={{ padding: '14px 10px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Seminar</th>
                  <th style={{ padding: '14px 10px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Kategori</th>
                  <th style={{ padding: '14px 10px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Pembicara</th>
                  <th style={{ padding: '14px 10px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Jadwal</th>
                  <th style={{ padding: '14px 10px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Lokasi</th>
                  <th style={{ padding: '14px 10px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Kuota</th>
                  <th style={{ padding: '14px 10px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt, idx) => (
                  <tr key={evt.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '14px 10px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.9rem' }}>{idx + 1}</td>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{evt.title}</div>
                      <div style={{ color: '#8a8aaa', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.description}</div>
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'center', overflow: 'hidden' }}>
                      <span className="badge badge-primary" style={{ display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{evt.category?.name || '-'}</span>
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.88rem', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.pembicara?.name || '-'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#8a8aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.pembicara?.email || ''}</div>
                    </td>
                    <td style={{ padding: '14px 10px', fontSize: '0.85rem', color: '#5a5a7a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.date}</td>
                    <td style={{ padding: '14px 10px', fontSize: '0.85rem', color: '#5a5a7a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.location}</td>
                    <td style={{ padding: '14px 10px', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600, color: '#1a1a2e' }}>{evt.maxParticipants}</td>
                    <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button 
                          className="btn-icon edit" 
                          onClick={() => handleOpenEdit(evt)}
                          title="Edit Event"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(evt.id)}
                          title="Hapus Event"
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
        title={editingEvent ? 'Edit Jadwal Seminar' : 'Buat Event Seminar Baru'}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="alert alert-danger" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Judul Seminar</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul seminar"
              required
            />
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Kategori Event</label>
              <select
                className="form-input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label">Pembicara / Narasumber</label>
              <select
                className="form-input"
                value={pembicaraId}
                onChange={(e) => setPembicaraId(e.target.value)}
                required
              >
                {speakers.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Tanggal & Jam Pelaksanaan</label>
              <input
                type="text"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Contoh: Sabtu, 28 Mei 2026 pukul 09:00 WIB"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Kapasitas Maksimal</label>
              <input
                type="number"
                className="form-input"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                min={1}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lokasi / Ruangan</label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Auditorium Utama Lantai 3 atau Zoom Meeting ID"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Lengkap Event</label>
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail acara, target audiens, prasyarat mengikuti seminar..."
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEvent ? 'Simpan Perubahan' : 'Buat Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ManageEvents;
