import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { tableService } from '../../services/tableService';

export default function AdminTableConfigPage() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtreleme
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'passive'

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: 0, tableNumber: '', capacity: 2, isAvailable: true });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const data = await tableService.getAll();
            // Masaları numarasına göre sırala (Doğal sıralama: A1, A2, A10)
            const sorted = data.sort((a, b) => a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true }));
            setTables(sorted);
            setLoading(false);
        } catch (error) { toast.error("Masalar yüklenemedi."); }
    };

    // --- FİLTRELEME ---
    const filteredTables = tables.filter(table => {
        const matchesSearch = table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = 
            filterStatus === 'all' ? true :
            filterStatus === 'active' ? table.isAvailable :
            !table.isAvailable;
        return matchesSearch && matchesStatus;
    });

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
        catch { toast.error("Silinemedi (Aktif sipariş olabilir)."); }
    };

    const openModal = (item = null) => {
        setIsEditMode(!!item);
        setFormData(item || { id: 0, tableNumber: '', capacity: 4, isAvailable: true });
        setShowModal(true);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Masa Düzeni</h2>
                    <p className="text-muted mb-0">Restoran kapasitesini ve masa durumlarını yönetin.</p>
                </div>
                <button className="btn btn-dark" onClick={() => openModal()}><i className="fas fa-plus me-2"></i> Yeni Masa</button>
            </div>

            {/* ARAÇ ÇUBUĞU */}
            <div className="card border-0 shadow-sm mb-4 bg-light">
                <div className="card-body d-flex flex-wrap gap-3 align-items-center">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                        <input type="text" className="form-control border-start-0" placeholder="Masa No Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select className="form-select" style={{ maxWidth: '200px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">Tüm Masalar</option>
                        <option value="active">Aktif Olanlar</option>
                        <option value="passive">Pasif (Kapalı)</option>
                    </select>
                    <div className="ms-auto text-muted small">Toplam <strong>{filteredTables.length}</strong> masa.</div>
                </div>
            </div>

            {/* MASA KARTLARI */}
            <div className="row g-3">
                {filteredTables.map(table => (
                    <div key={table.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                        <div className={`card h-100 shadow-sm border-0 position-relative ${!table.isAvailable ? 'bg-secondary bg-opacity-10' : ''}`}>
                            {/* Durum Rozeti */}
                            <span className={`position-absolute top-0 end-0 badge m-2 ${table.isAvailable ? 'bg-success' : 'bg-secondary'}`}>
                                {table.isAvailable ? 'AKTİF' : 'PASİF'}
                            </span>

                            <div className="card-body text-center p-4">
                                <i className={`fas fa-chair fa-3x mb-3 ${table.isAvailable ? 'text-dark' : 'text-muted opacity-50'}`}></i>
                                <h5 className="fw-bold mb-1">{table.tableNumber}</h5>
                                <small className="text-muted">{table.capacity} Kişilik</small>
                                
                                <div className="mt-3 pt-3 border-top d-flex justify-content-center gap-2">
                                    <button className="btn btn-sm btn-outline-primary rounded-circle" onClick={() => openModal(table)} title="Düzenle">
                                        <i className="fas fa-pen"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDelete(table.id)} title="Sil">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">{isEditMode ? 'Masayı Düzenle' : 'Yeni Masa Ekle'}</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Masa No</label>
                                            <input type="text" className="form-control" value={formData.tableNumber} onChange={e => setFormData({ ...formData, tableNumber: e.target.value })} required />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Kapasite</label>
                                            <input type="number" className="form-control" min="1" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} required />
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check form-switch p-3 bg-light rounded border">
                                                <input className="form-check-input ms-0 me-2" type="checkbox" role="switch" checked={formData.isAvailable} onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })} style={{cursor:'pointer'}} />
                                                <label className="form-check-label fw-bold">Kullanıma Açık</label>
                                                <div className="form-text small">Pasif yaparsanız rezervasyonlarda görünmez.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
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