import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { reservationService } from '../services/reservationService';
import { tableService } from '../services/tableService';
import api from '../api/axiosInstance';
import TableDetailModal from '../components/TableDetailModal';
import ReservationEditModal from '../components/ReservationEditModal';
import { Link, useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedTableData, setSelectedTableData] = useState(null); 
    const [selectedReservation, setSelectedReservation] = useState(null);

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
            
            console.log("--- VERİLER GELDİ ---");
            console.log("Masalar:", tableRes);
            console.log("Rezervasyonlar:", resData);

            setReservations(resData);
            setTables(tableRes.sort((a, b) => a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true })));
            
            const activeOnes = orderRes.data.filter(o => o.status !== 'Completed' && o.status !== 'Canceled');
            setActiveOrders(activeOnes);
            setLoading(false);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    // --- MASA DURUMU KONTROLÜ ---
    const getTableStatus = (table) => {
        // 0. Masa Kapalı mı?
        if (!table.isAvailable) return { status: 'closed', text: 'KAPALI', color: 'secondary', icon: 'fa-ban' };

        // 1. Sipariş Var mı?
        const activeOrder = activeOrders.find(o => o.tableId === table.id);
        if (activeOrder) return { status: 'occupied', text: 'DOLU', color: 'danger', subText: `${activeOrder.totalAmount} ₺`, icon: 'fa-utensils', data: activeOrder };

        // 2. Rezervasyon Kontrolü
        const now = new Date();
        
        // BUGÜNKÜ REZERVASYONLARI BUL
        const todaysReservations = reservations.filter(r => {
            // Masa ID kontrolü
            if (r.tableId !== table.id) return false;
            // Statü kontrolü (Bekleyen veya Onaylı)
            if (r.status !== 0 && r.status !== 1) return false;

            const rDate = new Date(r.reservationDate);
            // Sadece bugünün rezervasyonları
            return rDate.toDateString() === now.toDateString();
        });

        // En yakın rezervasyonu bul
        if (todaysReservations.length > 0) {
            // Tarihe göre sırala (en yakın en üstte)
            todaysReservations.sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));
            
            const nextRes = todaysReservations[0];
            const resDate = new Date(nextRes.reservationDate);
            
            // Zaman farkını hesapla (Dakika)
            const diffMs = resDate - now;
            const diffMinutes = Math.floor(diffMs / 1000 / 60);
            const resTimeStr = resDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            // LOGLAMA (Sadece T-2 gibi belirli masalar için konsola bas)
            if (table.tableNumber === "T-2" || table.tableNumber === "A1") {
                console.log(`Masa ${table.tableNumber} Kontrol:`, {
                    RezervasyonSaati: resTimeStr,
                    ŞuAn: now.toLocaleTimeString(),
                    FarkDakika: diffMinutes,
                    Statü: nextRes.status
                });
            }

            // DURUM 1: Rezervasyon saati içindeyiz (Başlamasına 2 saat kalmış veya geçeli 2 saat olmamış)
            // Örnek: Rezervasyon 14:00. Şu an 12:00 (120dk) ile 16:00 (-120dk) arası ise "REZERVE" göster.
            if (diffMinutes <= 120 && diffMinutes >= -120) {
                const isPending = nextRes.status === 0;
                return { 
                    status: 'reserved', 
                    text: isPending ? 'TALEP' : 'REZERVE', 
                    color: isPending ? 'info' : 'warning', 
                    subText: `Saat: ${resTimeStr}`,
                    icon: 'fa-clock',
                    data: nextRes 
                };
            }
            
            // DURUM 2: Rezervasyon bugün ama daha saati gelmedi (2 saatten fazla var)
            // Bu durumda masa şu an "MÜSAİT" görünmeli ama "Akşama Dolu" ipucu verebiliriz.
        }

        // 3. Hiçbiri yoksa Müsait
        return { status: 'empty', text: 'MÜSAİT', color: 'success', subText: `${table.capacity} Kişilik`, icon: 'fa-chair' };
    };

    const handleTableClick = (table, statusObj) => {
        if (statusObj.status === 'occupied') {
            setSelectedTableData({ table: table, order: statusObj.data });
        } else if (statusObj.status === 'reserved') {
            setSelectedReservation(statusObj.data);
        } else {
            toast.info(`Masa ${table.tableNumber}: ${statusObj.text}`);
        }
    };

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="display-6" style={{ fontFamily: 'Playfair Display' }}>Yönetim Paneli</h1>
                    <p className="text-muted">Salon durumu ve hızlı işlemler.</p>
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
                    <Link to="/admin/settings" className="btn btn-outline-dark"><i className="fas fa-cog me-2"></i> Ayarlar</Link>
                </div>
            </div>

            <h4 className="mt-4 mb-3" style={{ fontFamily: 'Playfair Display' }}>Salon Durumu</h4>
            
            <div className="row g-3">
                {tables.map(table => {
                    const statusObj = getTableStatus(table);
                    const { color, text, subText, icon } = statusObj;

                    return (
                        <div key={table.id} className="col-6 col-md-4 col-lg-3">
                            <div 
                                className={`card h-100 shadow-sm text-center border-${color} border-2 position-relative`}
                                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => handleTableClick(table, statusObj)}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div className={`card-header py-1 fw-bold text-white bg-${color}`}>
                                    {table.tableNumber}
                                </div>
                                <div className="card-body d-flex flex-column justify-content-center align-items-center p-3">
                                    <i className={`fas ${icon} fa-2x mb-2 text-${color} opacity-75`}></i>
                                    <h6 className={`fw-bold text-${color} mb-0`}>{text}</h6>
                                    <small className="text-muted mt-1">{subText}</small>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {selectedTableData && (
                <TableDetailModal
                    table={selectedTableData.table}
                    activeOrder={selectedTableData.order}
                    onClose={() => setSelectedTableData(null)}
                    onUpdate={fetchData}
                />
            )}

            {selectedReservation && (
                <ReservationEditModal
                    reservation={selectedReservation}
                    onClose={() => setSelectedReservation(null)}
                    onUpdate={fetchData}
                />
            )}
        </div>
    );
}

export default AdminDashboard;