import React from 'react';
import { reservationService } from '../services/reservationService';
import { toast } from 'react-toastify';

export default function ReservationDetailModal({ reservation, onClose, onUpdate }) {
    if (!reservation) return null;

    // Durum Değiştirme Fonksiyonu (Admin için)
    const handleStatusChange = async (newStatus) => {
        try {
            const updatedRes = { ...reservation, status: newStatus };
            await reservationService.update(reservation.id, updatedRes);
            
            const statusText = newStatus === 1 ? 'Onaylandı' : (newStatus === 2 ? 'Reddedildi' : 'İptal Edildi');
            toast.success(`Rezervasyon ${statusText}.`);
            
            onUpdate(); // Ana listeyi yenile
            onClose();  // Modalı kapat
        } catch (error) {
            toast.error("İşlem başarısız.");
        }
    };

    // Durum Rozeti (Görsel)
    const getStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="badge bg-warning text-dark px-3 py-2">Bekliyor</span>;
            case 1: return <span className="badge bg-success px-3 py-2">Onaylandı</span>;
            case 2: return <span className="badge bg-danger px-3 py-2">Reddedildi</span>;
            case 3: return <span className="badge bg-secondary px-3 py-2">İptal Edildi</span>;
            default: return <span className="badge bg-light text-dark border">Bilinmiyor</span>;
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    
                    {/* BAŞLIK */}
                    <div className="modal-header bg-dark text-white border-0">
                        <h5 className="modal-title" style={{ fontFamily: 'Playfair Display' }}>
                            Rezervasyon Detayı #{reservation.id}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    {/* İÇERİK */}
                    <div className="modal-body p-4">
                        
                        {/* Müşteri Kartı */}
                        <div className="d-flex align-items-center mb-4 p-3 bg-light rounded">
                            <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 me-3" style={{ width: '60px', height: '60px' }}>
                                {reservation.customerName ? reservation.customerName.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div>
                                <h5 className="mb-0 fw-bold">{reservation.customerName}</h5>
                                <div className="text-muted small">
                                    <i className="fas fa-phone me-1"></i> {reservation.customerPhone}
                                </div>
                                <div className="text-muted small">
                                    <i className="fas fa-user-tag me-1"></i> Oluşturan ID: {reservation.createdBy || 'Sistem'}
                                </div>
                            </div>
                        </div>

                        <hr className="border-secondary opacity-10 my-4" />

                        {/* Detaylar */}
                        <div className="row g-3">
                            <div className="col-6">
                                <label className="small text-muted fw-bold text-uppercase">Tarih & Saat</label>
                                <p className="mb-0 fw-bold text-dark">
                                    <i className="far fa-calendar-alt me-2 text-warning"></i>
                                    {new Date(reservation.reservationDate).toLocaleDateString('tr-TR')}
                                </p>
                                <p className="mb-0 ps-4 small text-muted">
                                    {new Date(reservation.reservationDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="col-6">
                                <label className="small text-muted fw-bold text-uppercase">Kişi Sayısı</label>
                                <p className="fw-bold text-dark">
                                    <i className="fas fa-users me-2 text-warning"></i>
                                    {reservation.numberOfGuests} Misafir
                                </p>
                            </div>
                            <div className="col-6">
                                <label className="small text-muted fw-bold text-uppercase">Masa Durumu</label>
                                <p className="fw-bold text-dark">
                                    <i className="fas fa-chair me-2 text-warning"></i>
                                    {reservation.tableId ? `Masa ${reservation.tableId}` : 'Otomatik Atama'}
                                </p>
                            </div>
                            <div className="col-6">
                                <label className="small text-muted fw-bold text-uppercase">Mevcut Durum</label>
                                <div>{getStatusBadge(reservation.status)}</div>
                            </div>
                        </div>

                        {/* Notlar */}
                        {reservation.specialRequests && (
                            <div className="mt-4">
                                <label className="small text-muted fw-bold text-uppercase">Müşteri Notu</label>
                                <div className="alert alert-warning bg-opacity-10 border-warning text-dark mb-0">
                                    <i className="fas fa-quote-left me-2 opacity-50"></i>
                                    {reservation.specialRequests}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AKSİYON BUTONLARI (Sadece Bekleyenler İçin) */}
                    <div className="modal-footer bg-light border-0 justify-content-between">
                        {reservation.status === 0 ? (
                            <>
                                <button className="btn btn-outline-danger px-4" onClick={() => handleStatusChange(2)}>
                                    <i className="fas fa-times me-2"></i> Reddet
                                </button>
                                <button className="btn btn-dark px-4" onClick={() => handleStatusChange(1)}>
                                    <i className="fas fa-check me-2"></i> Onayla
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-secondary w-100" onClick={onClose}>Kapat</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}