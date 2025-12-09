import React, { useEffect, useState } from 'react';
import { reservationService } from '../../services/reservationService';

export default function UserReservationsList() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            // Servisteki yeni fonksiyonu çağırıyoruz
            const data = await reservationService.getMyReservations();
            
            // Tarihe göre sırala (En yeni tarih en üstte)
            const sorted = data.sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate));
            setReservations(sorted);
            setLoading(false);
        } catch (error) {
            console.error("Rezervasyonlar alınamadı", error);
            setLoading(false);
        }
    };

    // Durum rengini ve metnini ayarlayan yardımcı fonksiyon
    const getStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="badge bg-warning text-dark">Onay Bekliyor</span>;
            case 1: return <span className="badge bg-success">Onaylandı</span>;
            case 2: return <span className="badge bg-danger">Reddedildi</span>;
            case 3: return <span className="badge bg-secondary">İptal Edildi</span>;
            default: return <span className="badge bg-light text-dark border">Bilinmiyor</span>;
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                <h5 className="mb-0" style={{ fontFamily: 'Playfair Display' }}>Rezervasyon Geçmişim</h5>
            </div>
            <div className="card-body p-0">
                {reservations.length === 0 ? (
                    <div className="p-5 text-center text-muted">
                        <i className="fas fa-calendar-times fa-3x mb-3 opacity-25"></i>
                        <p>Henüz bir rezervasyon kaydınız bulunmuyor.</p>
                        <a href="/reservations" className="btn btn-sm btn-dark mt-2">Rezervasyon Yap</a>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Tarih</th>
                                    <th>Saat</th>
                                    <th>Kişi</th>
                                    <th>Masa</th>
                                    <th>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map(res => (
                                    <tr key={res.id}>
                                        <td className="ps-4 fw-bold text-dark">
                                            {new Date(res.reservationDate).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="text-muted">
                                            <i className="far fa-clock me-1"></i>
                                            {new Date(res.reservationDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td>{res.numberOfGuests} Kişilik</td>
                                        <td>
                                            {/* Admin masa atamış mı kontrol et */}
                                            {res.tableId ? (
                                                <span className="badge bg-light text-dark border border-secondary">
                                                    Masa {res.tableId}
                                                </span>
                                            ) : (
                                                <span className="text-muted fst-italic small">Henüz Atanmadı</span>
                                            )}
                                        </td>
                                        <td>{getStatusBadge(res.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}