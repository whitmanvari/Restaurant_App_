import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { reservationService } from '../../services/reservationService';
import { tableService } from '../../services/tableService';
import { useSelector } from 'react-redux';
// YENİ IMPORT
import ReservationDetailModal from '../../components/ReservationDetailModal'; 

export default function AdminReservationPage() {
    const { user } = useSelector(state => state.auth);
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // Seçili rezervasyon için state
    const [selectedReservation, setSelectedReservation] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [resData, tableData] = await Promise.all([
                reservationService.getAll(), 
                tableService.getAll() 
            ]);
            
            const sorted = resData.sort((a, b) => {
                if (a.status === 0 && b.status !== 0) return -1;
                if (a.status !== 0 && b.status === 0) return 1;
                return new Date(a.reservationDate) - new Date(b.reservationDate);
            });

            setReservations(sorted);
            setTables(tableData);
            setLoading(false);
        } catch (error) {
            toast.error("Veriler yüklenirken hata oluştu.");
            setLoading(false);
        }
    };

    const getTableNumber = (tableId) => {
        if (!tableId) return <span className="text-muted fst-italic">Otomatik</span>;
        const table = tables.find(t => t.id === tableId);
        return table ? table.tableNumber : 'Bilinmiyor';
    };

    // Hızlı Onay (Listeden direkt onaylamak için)
    const handleQuickApprove = async (reservation) => {
        const updatedRes = { ...reservation, status: 1, reservationDate: reservation.reservationDate };
        try {
            await reservationService.update(reservation.id, updatedRes);
            toast.success("Rezervasyon onaylandı.");
            loadData();
        } catch { toast.error("Hata oluştu."); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
        try {
            await reservationService.remove(id);
            toast.success("Rezervasyon silindi.");
            loadData();
        } catch { toast.error("Silinemedi."); }
    };
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="badge bg-warning text-dark px-2">Bekliyor</span>;
            case 1: return <span className="badge bg-success px-2">Onaylı</span>;
            case 2: return <span className="badge bg-danger px-2">Red</span>;
            case 3: return <span className="badge bg-secondary px-2">İptal</span>;
            default: return <span className="badge bg-light text-dark border">?</span>;
        }
    };

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Rezervasyon Yönetimi</h2>
                    <p className="text-muted">
                        Hoşgeldin {user?.fullName}. 
                        <span className="text-warning fw-bold ms-2">
                            {reservations.filter(r => r.status === 0).length} Bekleyen Talep
                        </span>
                    </p>
                </div>
                <button className="btn btn-outline-dark" onClick={loadData}><i className="fas fa-sync-alt me-2"></i> Yenile</button>
            </div>

            <div className="card shadow-sm border-0" style={{ backgroundColor: 'var(--bg-card)' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-main)' }}>
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Durum</th>
                                <th>Tarih</th>
                                <th>Müşteri</th>
                                <th>Kişi</th>
                                <th>Masa</th>
                                <th className="text-end pe-4">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map(r => (
                                <tr key={r.id} className={r.status === 0 ? 'table-warning bg-opacity-10' : ''} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td className="ps-4">{getStatusBadge(r.status)}</td>
                                    <td>
                                        <div className="fw-bold">{new Date(r.reservationDate).toLocaleDateString('tr-TR')}</div>
                                        <small className="text-muted">{new Date(r.reservationDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</small>
                                    </td>
                                    <td>
                                        <div className="fw-bold">{r.customerName}</div>
                                        <small className="text-muted">{r.customerPhone}</small>
                                    </td>
                                    <td>{r.numberOfGuests}</td>
                                    <td><span className="badge bg-light text-dark border">{getTableNumber(r.tableId)}</span></td>
                                    
                                    <td className="text-end pe-4">
                                        {/* DETAY BUTONU (GÖZ) */}
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setSelectedReservation(r)} title="Detayları Gör">
                                            <i className="fas fa-eye"></i>
                                        </button>

                                        {/* HIZLI ONAY (Sadece Bekleyenler İçin) */}
                                        {r.status === 0 && (
                                            <button className="btn btn-sm btn-success me-2" onClick={() => handleQuickApprove(r)} title="Hızlı Onayla">
                                                <i className="fas fa-check"></i>
                                            </button>
                                        )}
                                        
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)} title="Sil">
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {reservations.length === 0 && <tr><td colSpan="6" className="text-center py-5 text-muted">Kayıt yok.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {selectedReservation && (
                <ReservationDetailModal 
                    reservation={selectedReservation} 
                    onClose={() => setSelectedReservation(null)} 
                    onUpdate={loadData} 
                />
            )}
        </div>
    );
}