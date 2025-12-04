import React, { useState } from 'react';
import { reservationService } from '../services/reservationService';
import { toast } from 'react-toastify';

function ReservationEditModal({ reservation, onClose, onUpdate }) {
    
    // Helper: Backend tarihini (ISO) input formatına (YYYY-MM-DDTHH:mm) çevir
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Timezone farkını düzelterek yerel saati inputa ver
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toISOString().slice(0, 16);
    };

    // Form State
    const [formData, setFormData] = useState({
        id: reservation.id,
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        reservationDate: formatDateForInput(reservation.reservationDate), 
        numberOfGuests: reservation.numberOfGuests,
        tableId: reservation.tableId || '', // Boşsa boş string
        specialRequests: reservation.specialRequests || '',
        status: reservation.status,
        createdBy: reservation.createdBy // Değiştirilmemeli ama taşınmalı
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Tarihi tekrar ISO formatına çevirmeden gönderiyoruz, backend date parse edebilir.
            // Ancak tableId boş string ise null veya 0 gönderelim
            const payload = {
                ...formData,
                tableId: formData.tableId ? parseInt(formData.tableId) : null
            };

            await reservationService.update(formData.id, payload);
            toast.success("Rezervasyon başarıyla güncellendi.");
            onUpdate(); // Listeyi yenile
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Güncelleme sırasında hata oluştu.");
        }
    };

    const handleDelete = async () => {
        if(!window.confirm("Bu rezervasyonu tamamen silmek istediğinize emin misiniz?")) return;
        
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
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    
                    {/* HEADER */}
                    <div className="modal-header bg-warning text-dark border-0">
                        <h5 className="modal-title fw-bold">
                            <i className="fas fa-edit me-2"></i> Rezervasyonu Düzenle
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* BODY */}
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            
                            {/* Müşteri Bilgileri */}
                            <h6 className="text-muted small text-uppercase fw-bold mb-3">Müşteri Bilgileri</h6>
                            <div className="mb-3">
                                <label className="form-label small">Ad Soyad</label>
                                <input type="text" className="form-control" name="customerName" value={formData.customerName} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small">Telefon</label>
                                <input type="text" className="form-control" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required />
                            </div>

                            <hr className="my-4 opacity-25"/>

                            {/* Rezervasyon Detayları */}
                            <h6 className="text-muted small text-uppercase fw-bold mb-3">Rezervasyon Detayları</h6>
                            <div className="row g-3 mb-3">
                                <div className="col-md-7">
                                    <label className="form-label small">Tarih & Saat</label>
                                    <input type="datetime-local" className="form-control" name="reservationDate" value={formData.reservationDate} onChange={handleChange} required />
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label small">Kişi Sayısı</label>
                                    <input type="number" className="form-control" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange} required min="1" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small">Masa ID (Opsiyonel)</label>
                                <input type="number" className="form-control" name="tableId" value={formData.tableId} onChange={handleChange} placeholder="Örn: 5" />
                                <div className="form-text small">Belirli bir masaya atamak için ID girin.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small">Notlar</label>
                                <textarea className="form-control" name="specialRequests" rows="2" value={formData.specialRequests} onChange={handleChange}></textarea>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="modal-footer bg-light border-0 d-flex justify-content-between">
                            <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
                                <i className="fas fa-trash-alt me-2"></i> Sil
                            </button>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
                                <button type="submit" className="btn btn-dark px-4">Kaydet</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReservationEditModal;