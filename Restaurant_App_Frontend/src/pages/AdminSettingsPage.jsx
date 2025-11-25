import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { categoryService } from '../services/categoryService';
import { tableService } from '../services/tableService';

function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('categories'); 
    const [categories, setCategories] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal & Form
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catRes, tableRes] = await Promise.all([
                categoryService.getAll(),
                // Sadece masaların listesini çekmek yeterli
                tableService.getAll() 
            ]);
            setCategories(catRes);
            setTables(tableRes);
            setLoading(false);
        } catch (error) {
            toast.error("Veriler yüklenemedi.");
        }
    };

    // --- MODAL & CRUD ---
    const openAddModal = (type) => {
        setIsEditMode(false);
        setFormData(type === 'category' 
            ? { type: 'category', name: '', description: '' } 
            : { type: 'table', tableNumber: '', capacity: 2 }
        );
        setShowModal(true);
    };

    const openEditModal = (type, item) => {
        setIsEditMode(true);
        setFormData(type === 'category'
            ? { type: 'category', id: item.id, name: item.name, description: item.description }
            : { type: 'table', id: item.id, tableNumber: item.tableNumber, capacity: item.capacity, isAvailable: item.isAvailable } // isAvailable'ı almayı unutma
        );
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.type === 'category') {
                const payload = { id: formData.id, name: formData.name, description: formData.description };
                isEditMode ? await categoryService.update(payload.id, payload) : await categoryService.create(payload);
            } else {
                // Masa güncellenirken isAvailable değerini koru
                const isAvail = isEditMode ? formData.isAvailable : true; 
                const payload = { id: formData.id, tableNumber: formData.tableNumber, capacity: parseInt(formData.capacity), isAvailable: isAvail };
                isEditMode ? await tableService.update(payload.id, payload) : await tableService.create(payload);
            }
            toast.success("İşlem başarılı.");
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error("Kaydetme başarısız.");
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm("Silmek istediğinize emin misiniz? Bağlı veriler etkilenebilir.")) return;
        try {
            type === 'category' ? await categoryService.remove(id) : await tableService.remove(id);
            toast.success("Kayıt silindi.");
            fetchData();
        } catch (error) {
            toast.error("Silinemedi (Bağlı kayıtlar olabilir).");
        }
    };

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Restoran Ayarları</h2>
                    <p className="text-muted">Menü kategorilerini ve masa düzenini buradan yönetebilirsiniz.</p>
                </div>
                <button className="btn btn-dark" onClick={() => openAddModal(activeTab === 'categories' ? 'category' : 'table')}>
                    <i className="fas fa-plus me-2"></i>
                    Yeni {activeTab === 'categories' ? 'Kategori' : 'Masa'} Ekle
                </button>
            </div>

            {/* TABS */}
            <div className="card border-0 shadow-sm" style={{backgroundColor: 'var(--bg-card)'}}>
                <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'categories' ? 'active fw-bold text-dark' : 'text-muted'}`} onClick={() => setActiveTab('categories')}>
                                <i className="fas fa-tags me-2"></i> Kategoriler
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'tables' ? 'active fw-bold text-dark' : 'text-muted'}`} onClick={() => setActiveTab('tables')}>
                                <i className="fas fa-chair me-2"></i> Masalar
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0" style={{color: 'var(--text-main)'}}>
                            <thead className="bg-light">
                                {activeTab === 'categories' ? (
                                    <tr>
                                        <th className="ps-4">Kategori Adı</th>
                                        <th>Açıklama</th>
                                        <th className="text-end pe-4">İşlemler</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th className="ps-4">Masa No</th>
                                        <th>Kapasite</th>
                                        <th>Durum (isAvailable)</th>
                                        <th className="text-end pe-4">İşlemler</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {activeTab === 'categories' ? (
                                    categories.map(cat => (
                                        <tr key={cat.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                                            <td className="ps-4 fw-bold">{cat.name}</td>
                                            <td className="text-muted small">{cat.description || '-'}</td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-link text-primary" onClick={() => openEditModal('category', cat)}><i className="fas fa-edit"></i></button>
                                                <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete('category', cat.id)}><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    tables.map(tbl => (
                                        <tr key={tbl.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                                            <td className="ps-4 fw-bold">{tbl.tableNumber}</td>
                                            <td>{tbl.capacity} Kişi</td>
                                            <td>
                                                <span className={`badge ${tbl.isAvailable ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                                    {tbl.isAvailable ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-link text-primary" onClick={() => openEditModal('table', tbl)}><i className="fas fa-edit"></i></button>
                                                <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete('table', tbl.id)}><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    {isEditMode ? 'Düzenle' : 'Yeni Ekle'}: {formData.type === 'category' ? 'Kategori' : 'Masa'}
                                </h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {formData.type === 'category' ? (
                                        <>
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold">Kategori Adı</label>
                                                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold">Açıklama</label>
                                                <input type="text" className="form-control" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold">Masa Numarası (Örn: A1)</label>
                                                <input type="text" className="form-control" value={formData.tableNumber} onChange={e => setFormData({ ...formData, tableNumber: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold">Kapasite</label>
                                                <input type="number" className="form-control" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} required min="1" />
                                            </div>
                                            {isEditMode && (
                                                <div className="form-check form-switch mb-3">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        role="switch" 
                                                        checked={formData.isAvailable}
                                                        onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                                                        id="isAvailableSwitch"
                                                    />
                                                    <label className="form-check-label" htmlFor="isAvailableSwitch">Şu an kullanıma müsait mi?</label>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>İptal</button>
                                    <button type="submit" className="btn btn-dark px-4">Kaydet</button>
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