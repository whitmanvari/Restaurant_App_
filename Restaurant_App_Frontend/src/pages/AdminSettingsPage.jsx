import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { categoryService } from '../services/categoryService';
import { tableService } from '../services/tableService';

function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'tables'

    // Data States
    const [categories, setCategories] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Generic Form Data (Hem kategori hem masa için ortak)
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catRes, tableRes] = await Promise.all([
                categoryService.getAll(),
                tableService.getAll()
            ]);
            setCategories(catRes);
            setTables(tableRes);
            setLoading(false);
        } catch (error) {
            toast.error("Veriler yüklenemedi.");
        }
    };

    // --- MODAL AÇMA İŞLEMLERİ ---
    const openAddModal = (type) => {
        setIsEditMode(false);
        if (type === 'category') {
            setFormData({ type: 'category', name: '', description: '' });
        } else {
            setFormData({ type: 'table', tableNumber: '', capacity: 2 });
        }
        setShowModal(true);
    };

    const openEditModal = (type, item) => {
        setIsEditMode(true);
        if (type === 'category') {
            setFormData({ type: 'category', id: item.id, name: item.name, description: item.description });
        } else {
            setFormData({ type: 'table', id: item.id, tableNumber: item.tableNumber, capacity: item.capacity });
        }
        setShowModal(true);
    };

    // --- CRUD İŞLEMLERİ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.type === 'category') {
                const payload = { id: formData.id, name: formData.name, description: formData.description };
                if (isEditMode) await categoryService.update(payload.id, payload);
                else await categoryService.create(payload);
            } else {
                const payload = { id: formData.id, tableNumber: formData.tableNumber, capacity: parseInt(formData.capacity), isAvailable: true };
                if (isEditMode) await tableService.update(payload.id, payload);
                else await tableService.create(payload);
            }
            toast.success("İşlem başarılı.");
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error("Kaydetme başarısız.");
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
        try {
            if (type === 'category') await categoryService.remove(id);
            else await tableService.remove(id);

            toast.success("Silindi.");
            fetchData();
        } catch (error) {
            toast.error("Silinemedi (Bağlı kayıtlar olabilir).");
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'Playfair Display' }}>Restoran Ayarları</h2>
                <button className="btn btn-dark" onClick={() => openAddModal(activeTab === 'categories' ? 'category' : 'table')}>
                    <i className="fas fa-plus me-2"></i>
                    Yeni {activeTab === 'categories' ? 'Kategori' : 'Masa'} Ekle
                </button>
            </div>

            {/* TABS */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'categories' ? 'active text-dark fw-bold' : 'text-muted'}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        Kategoriler
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'tables' ? 'active text-dark fw-bold' : 'text-muted'}`}
                        onClick={() => setActiveTab('tables')}
                    >
                        Masalar
                    </button>
                </li>
            </ul>

            {/* CONTENT */}
            <div className="card shadow-sm border-0 p-3">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            {activeTab === 'categories' ? (
                                <tr>
                                    <th>ID</th>
                                    <th>Kategori Adı</th>
                                    <th>Açıklama</th>
                                    <th className="text-end">İşlemler</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th>ID</th>
                                    <th>Masa No</th>
                                    <th>Kapasite</th>
                                    <th>Durum</th>
                                    <th className="text-end">İşlemler</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {activeTab === 'categories' ? (
                                categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>#{cat.id}</td>
                                        <td className="fw-bold">{cat.name}</td>
                                        <td>{cat.description}</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal('category', cat)}><i className="fas fa-edit"></i></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete('category', cat.id)}><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                tables.map(tbl => (
                                    <tr key={tbl.id}>
                                        <td>#{tbl.id}</td>
                                        <td className="fw-bold">{tbl.tableNumber}</td>
                                        <td>{tbl.capacity} Kişi</td>
                                        <td>{tbl.isAvailable ? <span className="badge bg-success">Aktif</span> : <span className="badge bg-danger">Pasif</span>}</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal('table', tbl)}><i className="fas fa-edit"></i></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete('table', tbl.id)}><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {isEditMode ? 'Düzenle' : 'Yeni Ekle'}: {formData.type === 'category' ? 'Kategori' : 'Masa'}
                                </h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {formData.type === 'category' ? (
                                        <>
                                            <div className="mb-3">
                                                <label className="form-label">Kategori Adı</label>
                                                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Açıklama</label>
                                                <input type="text" className="form-control" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-3">
                                                <label className="form-label">Masa Numarası (Örn: A1)</label>
                                                <input type="text" className="form-control" value={formData.tableNumber} onChange={e => setFormData({ ...formData, tableNumber: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Kapasite</label>
                                                <input type="number" className="form-control" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} required min="1" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                                    <button type="submit" className="btn btn-dark">Kaydet</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSettingsPage;