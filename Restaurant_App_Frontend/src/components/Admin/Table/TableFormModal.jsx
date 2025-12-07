import React, { useState, useEffect } from 'react';

export default function TableFormModal({ show, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({ 
        id: 0, 
        tableNumber: '', 
        capacity: 4, 
        isAvailable: true 
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ id: 0, tableNumber: '', capacity: 4, isAvailable: true });
        }
    }, [initialData, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, capacity: parseInt(formData.capacity) });
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">{initialData ? 'Masayı Düzenle' : 'Yeni Masa Ekle'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
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
                                        <input className="form-check-input ms-0 me-2" type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })} style={{ cursor: 'pointer' }} />
                                        <label className="form-check-label fw-bold">Kullanıma Açık</label>
                                        <div className="form-text small">Pasif yaparsanız operasyonda görünmez.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bg-light border-0">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
                            <button type="submit" className="btn btn-dark px-4">Kaydet</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}