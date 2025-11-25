import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { reservationService } from '../services/reservationService';
import api from '../api/axiosInstance';
import TableDetailModal from '../components/TableDetailModal';
import ReservationEditModal from '../components/ReservationEditModal';
import { Link } from 'react-router-dom'; 

function AdminDashboard() {
    const { user } = useSelector(state => state.auth);

    const [reservations, setReservations] = useState([]); // Sadece bekleyen sayısını görmek için
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
                api.get('/Table'),
                api.get('/OrderInRestaurant/all/details')
            ]);
            
            setReservations(resData); // Tüm rezervasyonları çek, bekleyen sayısını hesapla
            setTables(tableRes.data);
            
            const activeOnes = orderRes.data.filter(o =>
                o.status !== 'Completed' && o.status !== 'Canceled'
            );
            setActiveOrders(activeOnes);

            setLoading(false);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    // HELPER: Masa Durumunu Analiz Et
    const getTableStatus = (tableId) => {
        const activeOrder = activeOrders.find(o => o.tableId === tableId);
        if (activeOrder) return { status: 'occupied', data: activeOrder };

        const today = new Date().toISOString().slice(0, 10);
        const isReserved = reservations.find(r =>
            r.tableId === tableId &&
            r.status === 1 && // Sadece onaylı olanları say
            r.reservationDate.startsWith(today)
        );
        if (isReserved) return { status: 'reserved', data: isReserved };

        return { status: 'empty', data: null };
    };

    const handleTableClick = (table, status, activeOrderData) => {
        if (status === 'occupied' && activeOrderData) {
            setSelectedTableData({ table: table, order: activeOrderData });
        } else {
            toast.info(`Masa ${table.tableNumber} şu an ${status === 'empty' ? 'boş' : 'rezerve'}.`);
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
                    <Link to="/admin/settings" className="btn btn-outline-dark"><i className="fas fa-cog me-2"></i> Ayarlar</Link>
                </div>
            </div>

            {/* LIVE MAP ALANI */}
            <h4 className="mt-5 mb-4" style={{ fontFamily: 'Playfair Display' }}>Salon Durumu (Canlı Harita)</h4>
            
            <div className="row g-4">
                {tables.map(table => {
                    const { status, data } = getTableStatus(table.id);
                    let bgClass = 'bg-white';
                    let icon = 'fa-chair';
                    let statusText = 'Müsait';

                    if (status === 'occupied') {
                        bgClass = 'bg-danger text-white';
                        icon = 'fa-utensils';
                        statusText = 'Dolu';
                    } else if (status === 'reserved') {
                        bgClass = 'bg-warning text-dark';
                        icon = 'fa-clock';
                        statusText = 'Rezerve';
                    }

                    return (
                        <div
                            key={table.id}
                            className="col-6 col-md-4 col-lg-3"
                            onClick={() => handleTableClick(table, status, data)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={`card h-100 shadow-sm ${status === 'occupied' ? 'border-danger border-2' : 'border-success'}`}>
                                <div className={`card-header py-2 d-flex justify-content-between align-items-center ${bgClass}`}>
                                    <span className="fw-bold">{table.tableNumber}</span>
                                    <small>{statusText}</small>
                                </div>
                                <div className="card-body text-center">
                                    <i className={`fas ${icon} fa-2x mb-3 ${status === 'occupied' ? 'text-danger' : (status === 'reserved' ? 'text-warning' : 'text-success')}`}></i>
                                    {status === 'empty' && <p className="text-muted small">Kapasite: {table.capacity}</p>}
                                    {status === 'occupied' && (
                                        <div className="text-start small">
                                            <div className="fw-bold mb-1"><i className="fas fa-user me-1"></i> {data.userName || 'Misafir'}</div>
                                            <div className="text-danger fw-bold"><i className="fas fa-receipt me-1"></i> {data.totalAmount} ₺</div>
                                            <div className="text-muted mt-1 fst-italic">{data.status}</div>
                                        </div>
                                    )}
                                    {status === 'reserved' && (
                                        <div className="text-start small">
                                            <div className="fw-bold">{data.customerName}</div>
                                            <div className="text-muted"><i className="far fa-clock me-1"></i> {new Date(data.reservationDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    )}
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