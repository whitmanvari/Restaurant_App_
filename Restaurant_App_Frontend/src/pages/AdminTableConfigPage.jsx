import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { tableService } from '../services/tableService';

export default function AdminTableConfigPage() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: 0, tableNumber: '', capacity: 2, isAvailable: true });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const data = await tableService.getAll();
            setTables(data);
            setLoading(false);
        } catch (error) { toast.error("Masalar yüklenemedi."); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, capacity: parseInt(formData.capacity) };
            if (isEditMode) await tableService.update(formData.id, payload);
            else await tableService.create(payload);
            toast.success("İşlem başarılı.");
            setShowModal(false);
            fetchData();
        } catch (error) { toast.error("Kaydetme başarısız."); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Masayı silmek istediğinize emin misiniz?")) return;
        try { await tableService.remove(id); toast.success("Silindi."); fetchData(); } 
        catch { toast.error("Silinemedi."); }
    };

    const openModal = (item = null) => {
        setIsEditMode(!!item);
        setFormData(item || { id: 0, tableNumber: '', capacity: 2, isAvailable: true });
        setShowModal(true);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    return (
        <div className="container mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'Playfair Display' }}>Masa Düzeni</h2>
                <button className="btn btn-dark" onClick={() => openModal()}><i className="fas fa-plus me-2"></i> Yeni Masa</button>
            </div>
            <div className="card shadow-sm border-0"><div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light"><tr><th className="ps-4">No</th><th>Kapasite</th><th>Durum</th><th className="text-end pe-4">İşlem</th></tr></thead>
                    <tbody>
                        {tables.map(t => (
                            <tr key={t.id}>
                                <td className="ps-4 fw-bold">{t.tableNumber}</td>
                                <td>{t.capacity} Kişi</td>
                                <td><span className={`badge ${t.isAvailable ? 'bg-success' : 'bg-danger'}`}>{t.isAvailable ? 'Aktif' : 'Pasif'}</span></td>
                                <td className="text-end pe-4">
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(t)}><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)}><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div></div>
            
            {showModal && (
                <div className="modal fade show d-block" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header"><h5 className="modal-title">{isEditMode ? 'Düzenle' : 'Ekle'}</h5><button className="btn-close" onClick={() => setShowModal(false)}></button></div>
                            <form onSubmit={handleSubmit}><div className="modal-body">
                                <div className="mb-3"><label>Masa No</label><input className="form-control" value={formData.tableNumber} onChange={e=>setFormData({...formData, tableNumber:e.target.value})} required/></div>
                                <div className="mb-3"><label>Kapasite</label><input type="number" className="form-control" value={formData.capacity} onChange={e=>setFormData({...formData, capacity:e.target.value})} required/></div>
                                {isEditMode && <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={formData.isAvailable} onChange={e=>setFormData({...formData, isAvailable:e.target.checked})}/><label>Kullanıma Açık</label></div>}
                            </div><div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button><button type="submit" className="btn btn-dark">Kaydet</button></div></form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}