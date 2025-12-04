import React from 'react';
import { reservationService } from '../services/reservationService';
import { toast } from 'react-toastify';

export default function ReservationDetailModal({ reservation, onClose, onUpdate }) {
    if (!reservation) return null;

    // Durum Değiştirme (Sadece Admin için bu modalda aksiyon var)
    const handleStatusChange = async (newStatus) => {
        try {
            // Mevcut veriyi alıp sadece status'ü değiştirip gönderiyoruz
            const updatedRes = { ...reservation, status: newStatus };
            await reservationService.update(reservation.id, updatedRes);
            
            const statusText = newStatus === 1 ? 'Onaylandı' : 'Reddedildi';
            toast.success(`Rezervasyon ${statusText}.`);
            
            onUpdate(); // Listeyi yenile
            onClose();
        } catch (error) {
            toast.error("İşlem başarısız.");
        }
    };

    // Durum Rozeti
    const getStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="badge bg-warning text-dark px-3 py-2 shadow-sm">Onay Bekliyor</span>;
            case 1: return <span className="badge bg-success px-3 py-2 shadow-sm">Onaylandı</span>;
            case 2: return <span className="badge bg-danger px-3 py-2 shadow-sm">Reddedildi</span>;
            case 3: return <span className="badge bg-secondary px-3 py-2 shadow-sm">İptal Edildi</span>;
            default: return <span className="badge bg-light text-dark border">Bilinmiyor</span>;
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    
                    {/* HEADER */}
                    <div className="modal-header bg-dark text-white border-0">
                        <h5 className="modal-title" style={{ fontFamily: 'Playfair Display' }}>
                            Rezervasyon Detayı #{reservation.id}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body p-4">
                        
                        {/* Üst Bilgi Kartı */}
                        <div className="d-flex align-items-center mb-4 p-3 bg-light rounded border">
                            <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3 me-3 shadow-sm" style={{ width: '60px', height: '60px' }}>
                                {reservation.customerName ? reservation.customerName.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div>
                                <h5 className="mb-0 fw-bold text-dark">{reservation.customerName}</h5>
                                <div className="text-muted small mb-1">
                                    <i className="fas fa-phone me-1"></i> {reservation.customerPhone}
                                </div>
                                {/* Oluşturan Kullanıcı Adı */}
                                <div className="text-primary small">
                                    <i className="fas fa-user-circle me-1"></i> 
                                    Oluşturan: <strong>{reservation.createdByName || 'Sistem / Misafir'}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-6">
                                <div className="p-2 border rounded h-100">
                                    <label className="small text-muted fw-bold text-uppercase d-block mb-1">Tarih</label>
                                    <div className="fw-bold text-dark">
                                        <i className="far fa-calendar-alt me-2 text-warning"></i>
                                        {new Date(reservation.reservationDate).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-2 border rounded h-100">
                                    <label className="small text-muted fw-bold text-uppercase d-block mb-1">Saat</label>
                                    <div className="fw-bold text-dark">
                                        <i className="far fa-clock me-2 text-warning"></i>
                                        {new Date(reservation.reservationDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-2 border rounded h-100">
                                    <label className="small text-muted fw-bold text-uppercase d-block mb-1">Kişi Sayısı</label>
                                    <div className="fw-bold text-dark">
                                        <i className="fas fa-users me-2 text-warning"></i>
                                        {reservation.numberOfGuests} Misafir
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-2 border rounded h-100">
                                    <label className="small text-muted fw-bold text-uppercase d-block mb-1">Masa</label>
                                    <div className="fw-bold text-dark">
                                        <i className="fas fa-chair me-2 text-warning"></i>
                                        {reservation.tableId ? `Masa No: ${reservation.tableId}` : 'Otomatik Atama'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 d-flex justify-content-between align-items-center">
                             <span className="text-muted small text-uppercase fw-bold">Şu anki Durum:</span>
                             {getStatusBadge(reservation.status)}
                        </div>

                        {/* Özel Notlar */}
                        {reservation.specialRequests && (
                            <div className="mt-4">
                                <div className="alert alert-warning bg-warning bg-opacity-10 border-0 text-dark mb-0">
                                    <i className="fas fa-sticky-note me-2 opacity-50"></i>
                                    <strong>Not:</strong> {reservation.specialRequests}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FOOTER (Sadece Bekleyenler İçin Butonlar) */}
                    {reservation.status === 0 ? (
                        <div className="modal-footer bg-light border-0 d-flex justify-content-end gap-2">
                            <button className="btn btn-outline-danger px-4" onClick={() => handleStatusChange(2)}>
                                <i className="fas fa-times me-2"></i> Reddet
                            </button>
                            <button className="btn btn-success px-4" onClick={() => handleStatusChange(1)}>
                                <i className="fas fa-check me-2"></i> Onayla
                            </button>
                        </div>
                    ) : (
                        <div className="modal-footer bg-light border-0">
                            <button className="btn btn-secondary w-100" onClick={onClose}>Kapat</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}