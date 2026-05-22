import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import type { Category } from '../store/useStore';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, FolderOpen, AlertCircle } from 'lucide-react';

export const ManageCategories: React.FC = () => {
  const { 
    categories, 
    loading, 
    error, 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Nama Kategori harus diisi.');
      return;
    }

    let success = false;
    if (editingCategory) {
      success = await updateCategory(editingCategory.id, name, description);
    } else {
      success = await createCategory(name, description);
    }

    if (success) {
      setIsModalOpen(false);
      setName('');
      setDescription('');
    } else {
      setFormError('Gagal menyimpan kategori. Pastikan nama tidak duplikat.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini? Menghapus kategori juga akan menghapus semua event yang terkait.')) {
      await deleteCategory(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Kategori Event</h1>
          <p>Kelola klasifikasi atau jenis kategori seminar yang diselenggarakan.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          Tambah Kategori
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="glass-card">
        {loading && categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <FolderOpen />
            <h3>Belum ada Kategori</h3>
            <p>Klik tombol "Tambah Kategori" untuk membuat kategori seminar pertama Anda.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '60px' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '120px' }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(107,24,57,0.1)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>No</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Nama Kategori</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Deskripsi</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Jumlah Event</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '16px', textAlign: 'center', color: '#8a8aaa', fontSize: '0.9rem' }}>{idx + 1}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#1a1a2e', fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</td>
                    <td style={{ padding: '16px', color: '#5a5a7a', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat.description || <em style={{ color: '#bbb' }}>Tidak ada deskripsi</em>}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span className="badge badge-primary">
                        {cat._count?.events || 0} Event
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button 
                          className="btn-icon edit" 
                          onClick={() => handleOpenEdit(cat)}
                          title="Edit Kategori"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(cat.id)}
                          title="Hapus Kategori"
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
        title={editingCategory ? 'Edit Kategori Event' : 'Tambah Kategori Event'}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="alert alert-danger" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nama Kategori</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Teknologi, Agama, Soft Skill"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat mengenai kategori event..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ManageCategories;
