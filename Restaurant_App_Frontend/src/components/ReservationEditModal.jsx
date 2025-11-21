import React, { useState } from 'react';
import { reservationService } from '../services/reservationService';
import { toast } from 'react-toastify';

function ReservationEditModal({ reservation, onClose, onUpdate }) {
    // Form state'i mevcut rezervasyon bilgileriyle başlatıyoruz
    const [formData, setFormData] = useState({
        id: reservation.id,
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        reservationDate: reservation.reservationDate, 
        numberOfGuests: reservation.numberOfGuests,
        tableId: reservation.tableId,
        specialRequests: reservation.specialRequests || '',
        status: reservation.status // Statüyü koru
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend DTO'su "ReservationDTO" bekliyor.
            // ID URL'den gidiyor, body içinde de güncel veriler.
            await reservationService.update(formData.id, formData);
            toast.success("Rezervasyon güncellendi.");
            onUpdate(); // Dashboard listesini yenile
            onClose();
        } catch (error) {
            toast.error("Güncelleme başarısız.");
        }
    };

    const handleDelete = async () => {
        if(!window.confirm("Rezervasyonu tamamen silmek istiyor musunuz?")) return;
        try {
            await reservationService.remove(formData.id);
            toast.success("Rezervasyon silindi.");
            onUpdate();
            onClose();
        } catch (error) {
            toast.error("Silme işlemi başarısız.");
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-warning text-dark">
                        <h5 className="modal-title">Rezervasyonu Düzenle</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Müşteri Adı</label>
                                <input type="text" className="form-control" name="customerName" value={formData.customerName} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Telefon</label>
                                <input type="text" className="form-control" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required />
                            </div>
                            <div className="row g-2 mb-3">
                                <div className="col-7">
                                    <label className="form-label">Tarih & Saat</label>
                                    <input type="datetime-local" className="form-control" name="reservationDate" value={formData.reservationDate} onChange={handleChange} required />
                                </div>
                                <div className="col-5">
                                    <label className="form-label">Kişi Sayısı</label>
                                    <input type="number" className="form-control" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Masa ID (Opsiyonel)</label>
                                <input type="number" className="form-control" name="tableId" value={formData.tableId} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Notlar</label>
                                <textarea className="form-control" name="specialRequests" value={formData.specialRequests} onChange={handleChange}></textarea>
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
                                <i className="fas fa-trash me-2"></i> Sil
                            </button>
                            <div>
                                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>İptal</button>
                                <button type="submit" className="btn btn-dark">Güncelle</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReservationEditModal;