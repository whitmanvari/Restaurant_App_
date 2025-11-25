import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { reservationService } from '../services/reservationService'; 
import { tableService } from '../services/tableService'; 
import api from '../api/axiosInstance';
import TableDetailModal from '../components/TableDetailModal';
import { Link, useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    // State'ler
    const [reservations, setReservations] = useState([]); // Rezervasyon kayıtları
    const [tables, setTables] = useState([]); // Masa kayıtları (tablo numarası için)
    const [activeOrders, setActiveOrders] = useState([]); // Aktif siparişler
    const [loading, setLoading] = useState(true);
    const [selectedTableData, setSelectedTableData] = useState(null); 

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            // 1. Tüm verileri çek
            const [resData, tableRes, orderRes] = await Promise.all([
                reservationService.getAll(), // Tüm rezervasyonları çekiyoruz (AdminReservationPage gibi)
                tableService.getAll(), // Tüm masaları çekiyoruz
                api.get('/OrderInRestaurant/all/details') // Tüm aktif siparişleri çekiyoruz
            ]);
            
            setReservations(resData);
            setTables(tableRes);
            
            const activeOnes = orderRes.data.filter(o =>
                o.status !== 'Completed' && o.status !== 'Canceled'
            );
            setActiveOrders(activeOnes);

            setLoading(false);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    // HELPER: Masa Durumunu Analiz Et (Aynı gün ve çakışma kontrolü)
    const getTableStatus = (tableId) => {
        // 1. Check Active Orders (DOLU)
        const activeOrder = activeOrders.find(o => 
            o.tableId === tableId && 
            o.status !== 'Completed' && 
            o.status !== 'Canceled'
        );
        if (activeOrder) return { status: 'occupied', data: activeOrder, color: 'danger', text: 'Dolu' };

        // 2. Check Reservations (REZERVE) - Bugün içinde onaylı rezervasyon var mı?
        const now = new Date();
        const resForToday = reservations.filter(r =>
            r.tableId === tableId &&
            r.status === 1 && // ONAYLI
            new Date(r.reservationDate).toDateString() === now.toDateString()
        ).sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate)); // En yakın saati bul
        
        const nextRes = resForToday[0];

        if (nextRes) {
            // Ayrıca, bu rezervasyonun başlama zamanı 1 saatten daha kısa bir süre sonra mı?
            const resTime = new Date(nextRes.reservationDate);
            const timeUntilRes = (resTime.getTime() - now.getTime()) / (1000 * 60); // Dakika farkı

            // Eğer rezervasyon şimdi aktifse (geçmiş 1 saat veya gelecek 1 saat içindeyse)
            if (timeUntilRes <= 60 && timeUntilRes >= -120) {
                 return { status: 'reserved', data: nextRes, color: 'warning', text: 'Rezerve' };
            }
        }

        // 3. HİÇBİRİ YOKSA (MÜSAİT)
        return { status: 'empty', data: null, color: 'success', text: 'Müsait' };
    };

    const handleTableClick = (table, status, activeOrderData) => {
        if (status === 'occupied' && activeOrderData) {
            // Aktif sipariş varsa sipariş detay modalını aç
            setSelectedTableData({ table: table, order: activeOrderData });
        } else if (status === 'reserved') {
            // Rezervasyon varsa bilgi ver
            toast.info(`Masa ${table.tableNumber} bugün rezerve. ${new Date(activeOrderData.reservationDate).toLocaleTimeString()}`);
        } else {
            toast.info(`Masa ${table.tableNumber} şu an boş.`);
        }
    };

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-4">
            {/* BAŞLIK KISMI */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="display-6" style={{ fontFamily: 'Playfair Display' }}>Yönetim Paneli</h1>
                    <p className="text-muted">Merhaba Şef {user?.fullName}, bugün restoranın harika görünüyor.</p>
                </div>
                {/* Yönetim Butonları (Navbar'da da var, burada da kalsın) */}
                <div className="d-flex gap-2 flex-wrap">
                    <Link to="/admin/menu" className="btn btn-outline-dark"><i className="fas fa-utensils me-2"></i> Menü</Link>
                    <Link to="/admin/reservations" className="btn btn-outline-dark">
                        <i className="fas fa-calendar-check me-2"></i> Rezervasyonlar
                        {reservations.filter(r => r.status === 0).length > 0 &&
                            <span className="badge bg-danger ms-2">{reservations.filter(r => r.status === 0).length}</span>
                        }
                    </Link>
                    <Link to="/admin/orders" className="btn btn-outline-dark"><i className="fas fa-tasks me-2"></i> Siparişler</Link>
                    <Link to="/admin/settings" className="btn btn-outline-dark"><i className="fas fa-cog me-2"></i> Ayarlar</Link>
                </div>
            </div>

            {/* LIVE MAP ALANI */}
            <h4 className="mt-5 mb-4" style={{ fontFamily: 'Playfair Display' }}>Salon Durumu (Canlı Harita)</h4>
            
            <div className="row g-4">
                {tables.map(table => {
                    const { status, data, color, text } = getTableStatus(table.id);
                    let subText = status === 'occupied' ? `${data.totalAmount} ₺` : (status === 'reserved' ? new Date(data.reservationDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'}) : `${table.capacity} Kişilik`);

                    return (
                        <div
                            key={table.id}
                            className="col-6 col-md-4 col-lg-3"
                            onClick={() => handleTableClick(table, status, data)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={`card h-100 shadow-sm border-${color} border-2`}>
                                <div className={`card-header py-2 d-flex justify-content-between align-items-center bg-${color} text-white`}>
                                    <span className="fw-bold">Masa {table.tableNumber}</span>
                                    <small>{text}</small>
                                </div>
                                <div className="card-body text-center">
                                    <i className={`fas ${status === 'occupied' ? 'fa-utensils' : (status === 'reserved' ? 'fa-clock' : 'fa-chair')} fa-3x text-${color} mb-3 opacity-75`}></i>
                                    
                                    <div className="text-start small">
                                        <div className={`fw-bold ${status === 'occupied' ? 'text-danger' : ''}`}>{subText}</div>
                                        <div className="text-muted mt-1 fst-italic">Kapasite: {table.capacity}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            {/* MASA DETAY MODALI */}
            {selectedTableData && (
                <TableDetailModal
                    table={selectedTableData.table}
                    activeOrder={selectedTableData.order}
                    onClose={() => setSelectedTableData(null)}
                    onUpdate={() => { fetchData(); }}
                />
            )}
        </div>
    );
}

export default AdminDashboard;