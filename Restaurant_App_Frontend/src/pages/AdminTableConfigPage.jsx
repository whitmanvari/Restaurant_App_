import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { tableService } from '../services/tableService';

export default function AdminTableConfigPage() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtreleme State'leri
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'passive'

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: 0, tableNumber: '', capacity: 2, isAvailable: true });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const data = await tableService.getAll();
            // Masaları numarasına göre sıralayalım (A1, A2, B1...)
            const sortedData = data.sort((a, b) => a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true }));
            setTables(sortedData);
            setLoading(false);
        } catch (error) { toast.error("Masalar yüklenemedi."); }
    };

    // --- FİLTRELEME MANTIĞI ---
    const getFilteredTables = () => {
        return tables.filter(table => {
            // 1. Arama (Masa No)
            const matchesSearch = table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
            
            // 2. Durum Filtresi
            const matchesStatus = 
                filterStatus === 'all' ? true :
                filterStatus === 'active' ? table.isAvailable :
                !table.isAvailable; // 'passive'

            return matchesSearch && matchesStatus;
        });
    };

    const filteredTables = getFilteredTables();

    // --- CRUD ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, capacity: parseInt(formData.capacity) };
            if (isEditMode) await tableService.update(formData.id, payload);
            else await tableService.create(payload);
            toast.success(isEditMode ? "Masa güncellendi." : "Masa oluşturuldu.");
            setShowModal(false);
            fetchData();
        } catch (error) { toast.error("İşlem başarısız."); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Masayı silmek istediğinize emin misiniz?")) return;
        try { await tableService.remove(id); toast.success("Silindi."); fetchData(); } 
        catch { toast.error("Silinemedi."); }
    };

    const openModal = (item = null) => {
        setIsEditMode(!!item);
        setFormData(item || { id: 0, tableNumber: '', capacity: 4, isAvailable: true });
        setShowModal(true);
    };

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5 table-config-page">
            
            {/* ÜST BAŞLIK & BUTON */}
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Masa Düzeni</h2>
                    <p className="text-muted mb-0">Restoran yerleşim planını ve masa kapasitelerini yönetin.</p>
                </div>
                <button className="btn btn-dark px-4 py-2" onClick={() => openModal()}>
                    <i className="fas fa-plus me-2"></i> Yeni Masa Ekle
                </button>
            </div>

            {/* --- ARAÇ ÇUBUĞU (Toolbar) --- */}
            <div className="toolbar mb-5 d-flex flex-wrap gap-3 align-items-center">
                {/* Arama */}
                <div className="input-group" style={{ maxWidth: '300px' }}>
                    <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                    <input 
                        type="text" 
                        className="form-control border-start-0" 
                        placeholder="Masa No Ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filtre */}
                <select 
                    className="form-select" 
                    style={{ maxWidth: '200px' }}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Tüm Durumlar</option>
                    <option value="active">Sadece Aktifler</option>
                    <option value="passive">Sadece Pasifler</option>
                </select>

                <div className="ms-auto text-muted small">
                    Toplam <strong>{filteredTables.length}</strong> masa listeleniyor.
                </div>
            </div>

            {/* --- MASA KARTLARI (GRID) --- */}
            {filteredTables.length === 0 ? (
                <div className="text-center py-5 bg-light rounded">
                    <i className="fas fa-chair fa-3x text-muted mb-3 opacity-25"></i>
                    <p className="text-muted">Kriterlere uygun masa bulunamadı.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredTables.map(table => (
                        <div key={table.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                            <div className="table-card h-100">
                                {/* Durum Rozeti */}
                                <div className={`status-badge ${table.isAvailable ? 'active' : 'passive'}`}>
                                    {table.isAvailable ? 'AKTİF' : 'PASİF'}
                                </div>

                                <div className="card-content">
                                    {/* Masa İkonu - Kapasiteye göre değişebilir */}
                                    <div className="table-icon">
                                        {table.capacity <= 2 ? <i className="fas fa-user-friends"></i> : 
                                         table.capacity <= 4 ? <i className="fas fa-chair"></i> : 
                                         <i className="fas fa-users"></i>}
                                    </div>
                                    
                                    <div className="table-number">{table.tableNumber}</div>
                                    
                                    <div className="table-capacity">
                                        <i className="fas fa-user-group"></i> {table.capacity} Kişilik
                                    </div>
                                </div>

                                {/* Hover Butonları */}
                                <div className="action-buttons">
                                    <button className="btn btn-sm btn-outline-primary rounded-circle" onClick={() => openModal(table)} title="Düzenle">
                                        <i className="fas fa-pen"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDelete(table.id)} title="Sil">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">{isEditMode ? 'Masayı Düzenle' : 'Yeni Masa Ekle'}</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small">Masa Numarası</label>
                                            <input type="text" className="form-control" placeholder="Örn: A1, Bahçe-2" value={formData.tableNumber} onChange={e => setFormData({ ...formData, tableNumber: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small">Kapasite (Kişi)</label>
                                            <input type="number" className="form-control" min="1" max="20" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} required />
                                        </div>
                                        <div className="col-12 mt-4">
                                            <div className="form-check form-switch p-3 bg-light rounded border">
                                                <input 
                                                    className="form-check-input ms-0 me-3" 
                                                    type="checkbox" 
                                                    role="switch" 
                                                    id="isAvailableSwitch"
                                                    checked={formData.isAvailable}
                                                    onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                                                    style={{cursor: 'pointer'}}
                                                />
                                                <label className="form-check-label cursor-pointer fw-bold" htmlFor="isAvailableSwitch">
                                                    Masa Kullanıma Açık (Aktif)
                                                </label>
                                                <div className="form-text small mt-1">
                                                    Pasif yaparsanız bu masa rezervasyonlarda ve canlı haritada görünmez (Örn: Tadilat).
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light border-0">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>İptal</button>
                                    <button type="submit" className="btn btn-dark px-4">{isEditMode ? 'Güncelle' : 'Kaydet'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}