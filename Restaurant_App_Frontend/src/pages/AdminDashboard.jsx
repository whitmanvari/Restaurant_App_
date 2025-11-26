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

    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTableData, setSelectedTableData] = useState(null); 

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [resData, tableRes, orderRes] = await Promise.all([
                reservationService.getAll(),
                tableService.getAll(),
                api.get('/OrderInRestaurant/all/details')
            ]);
            
            setReservations(resData);
            setTables(tableRes);
            
            // Sadece aktif siparişleri filtrele
            const activeOnes = orderRes.data.filter(o =>
                o.status !== 'Completed' && o.status !== 'Canceled'
            );
            setActiveOrders(activeOnes);

            setLoading(false);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    // MASA DURUM KONTROLÜ (DÜZELTİLMİŞ VERSİYON)
    const getTableStatus = (tableId) => {
        // 1. Sipariş Kontrolü (KIRMIZI - DOLU)
        // Masada şu an açık bir sipariş var mı?
        const activeOrder = activeOrders.find(o => 
            o.tableId === tableId && o.status !== 'Completed' && o.status !== 'Canceled'
        );
        if (activeOrder) return { status: 'occupied', data: activeOrder, color: 'danger', text: 'DOLU', subText: `${activeOrder.totalAmount} ₺` };

        // 2. Rezervasyon Kontrolü (SARI - REZERVE)
        const now = new Date();
        
        const activeReservation = reservations.find(r => {
            // Masa ID kontrolü
            if (r.tableId !== tableId) return false;

            // Sadece Onaylı (1) veya Bekleyen (0) olanlar masayı tutar
            if (r.status !== 1 && r.status !== 0) return false;

            const resDate = new Date(r.reservationDate);
            
            // TARİH KONTROLÜ: Sadece BUGÜN olan rezervasyonlar
            const isSameDay = 
                resDate.getDate() === now.getDate() &&
                resDate.getMonth() === now.getMonth() &&
                resDate.getFullYear() === now.getFullYear();
            
            if (!isSameDay) return false;

            // SAAT KONTROLÜ (Milisaniye Hesabı )
            const diffMs = resDate.getTime() - now.getTime();
            const diffMinutes = diffMs / (1000 * 60); // Dakika cinsinden fark

            // KURAL: 
            // - Rezervasyona 120 dk (2 saat) kala "Rezerve" göster.
            // - Rezervasyon saati geçse bile 120 dk (2 saat) boyunca "Rezerve" göster (Müşteri geç kalmış veya oturuyor olabilir).
            // Yani fark -120 ile +120 arasındaysa.
            
            return diffMinutes > -120 && diffMinutes < 120;
        });
        
        if (activeReservation) {
            const isPending = activeReservation.status === 0;
            // Saati göster
            const timeString = new Date(activeReservation.reservationDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
            
            return { 
                status: 'reserved', 
                data: activeReservation,
                text: isPending ? 'TALEP' : 'REZERVE', 
                subText: `Saat: ${timeString}`,
                color: isPending ? 'info' : 'warning', // Bekleyenler Mavi, Onaylılar Sarı
            };
        }

        // 3. HİÇBİRİ YOKSA (YEŞİL - MÜSAİT)
        return { status: 'empty', data: null, color: 'success', text: 'MÜSAİT', subText: 'Boş' };
    };

    const handleTableClick = (table, status, activeOrderData) => {
        if (status === 'occupied' && activeOrderData) {
            setSelectedTableData({ table: table, order: activeOrderData });
        } else if (status === 'reserved') {
             const resTime = getTableStatus(table.id).subText;
             toast.info(`Masa ${table.tableNumber} bugün ${resTime} için rezerve edildi.`);
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
                <div className="d-flex gap-2 flex-wrap">
                    <Link to="/admin/menu" className="btn btn-outline-dark"><i className="fas fa-utensils me-2"></i> Menü</Link>
                    <Link to="/admin/reservations" className="btn btn-outline-dark">
                        <i className="fas fa-calendar-check me-2"></i> Rezervasyonlar
                        {reservations.filter(r => r.status === 0).length > 0 &&
                            <span className="badge bg-danger ms-2">{reservations.filter(r => r.status === 0).length}</span>
                        }
                    </Link>
                    <Link to="/admin/orders" className="btn btn-outline-dark"><i className="fas fa-tasks me-2"></i> Siparişler</Link>
                    <Link to="/admin/analytics" className="btn btn-outline-dark"><i className="fas fa-chart-pie me-2"></i> Raporlar</Link>
                    <Link to="/admin/users" className="btn btn-outline-dark"><i className="fas fa-users me-2"></i> Kullanıcılar</Link>
                    <Link to="/admin/settings" className="btn btn-outline-dark"><i className="fas fa-cog me-2"></i> Ayarlar</Link>
                </div>
            </div>

            {/* LIVE MAP ALANI */}
            <h4 className="mt-5 mb-4" style={{ fontFamily: 'Playfair Display' }}>Salon Durumu (Canlı Harita)</h4>
            
            <div className="row g-4">
                {tables.map(table => {
                    const { status, data, color, text, subText } = getTableStatus(table.id);

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
                                        <div className={`fw-bold ${status === 'occupied' ? 'text-danger' : (status === 'reserved' ? 'text-warning' : '')}`}>{subText}</div>
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