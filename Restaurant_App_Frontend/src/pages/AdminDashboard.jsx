import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { reservationService } from '../services/reservationService';
import api from '../api/axiosInstance';
import TableDetailModal from '../components/TableDetailModal';

function AdminDashboard() {
    const { user } = useSelector(state => state.auth);

    // State'ler
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('reservations'); // 'reservations' veya 'liveMap'
    const [loading, setLoading] = useState(true);
    const [selectedTableData, setSelectedTableData] = useState(null); // { table, order }

    // Verileri Çek
    useEffect(() => {
        fetchData();
        // Canlı takip için her 30 saniyede bir verileri yenileriz
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            // 1. Rezervasyonları çek
            const resData = await reservationService.getAll();
            setReservations(resData);

            // 2. Masaları çek
            const tableRes = await api.get('/Table');
            setTables(tableRes.data);

            // 3. Aktif Masa Siparişlerini çek
            const orderRes = await api.get('/OrderInRestaurant/all/details');
            const activeOnes = orderRes.data.filter(o =>
                o.status !== 'Completed' && o.status !== 'Canceled'
            );
            setActiveOrders(activeOnes);

            setLoading(false);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    //REZERVASYON İŞLEMLERİ 
    const handleStatusChange = async (reservation, newStatus) => {
        try {
            const updatedRes = { ...reservation, status: newStatus };
            await reservationService.update(reservation.id, updatedRes);

            toast.success(`Rezervasyon ${newStatus === 1 ? 'onaylandı' : 'reddedildi'}.`);
            fetchData();
        } catch (error) {
            toast.error("İşlem başarısız.");
        }
    };

    // HELPER: Masa Durumunu Analiz Et
    const getTableStatus = (tableId) => {
        const activeOrder = activeOrders.find(o => o.tableId === tableId);
        if (activeOrder) return { status: 'occupied', data: activeOrder };

        const today = new Date().toISOString().slice(0, 10);
        const isReserved = reservations.find(r =>
            r.tableId === tableId &&
            r.status === 1 &&
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
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-dark" onClick={() => window.location.href = '/admin/menu'}>
                        <i className="fas fa-utensils me-2"></i> Menü Yönetimi
                    </button>
                    <button
                        className={`btn ${activeTab === 'reservations' ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setActiveTab('reservations')}
                    >
                        <i className="fas fa-calendar-check me-2"></i> Rezervasyonlar
                        {reservations.filter(r => r.status === 0).length > 0 &&
                            <span className="badge bg-danger ms-2">{reservations.filter(r => r.status === 0).length}</span>
                        }
                    </button>
                    <button
                        className={`btn ${activeTab === 'liveMap' ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setActiveTab('liveMap')}
                    >
                        <i className="fas fa-th me-2"></i> Salon Durumu
                    </button>
                    <button className="btn btn-outline-dark" onClick={() => window.location.href = '/admin/orders'}>
                        <i className="fas fa-tasks me-2"></i> Siparişler
                    </button>
                    <button className="btn btn-outline-dark" onClick={() => window.location.href = '/admin/analytics'}>
                        <i className="fas fa-chart-pie me-2"></i> Raporlar
                    </button>
                    <button className="btn btn-outline-dark" onClick={() => window.location.href = '/admin/settings'}>
                        <i className="fas fa-cog me-2"></i> Ayarlar
                    </button>
                </div>
            </div>

            {/*TAB 1: REZERVASYONLAR*/}
            {activeTab === 'reservations' && (
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-white py-3">
                        <h5 className="mb-0">Bekleyen Talepler & Liste</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Müşteri</th>
                                    <th>Tarih/Saat</th>
                                    <th>Masa</th>
                                    <th>Kişi</th>
                                    <th>Durum</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.sort((a, b) => a.status - b.status).map(res => (
                                    <tr key={res.id} className={res.status === 0 ? 'table-warning' : ''}>
                                        <td>
                                            <div className="fw-bold">{res.customerName}</div>
                                            <small className="text-muted">{res.customerPhone}</small>
                                        </td>
                                        <td>{new Date(res.reservationDate).toLocaleString('tr-TR')}</td>
                                        <td>Masa {tables.find(t => t.id === res.tableId)?.tableNumber || '-'}</td>
                                        <td>{res.numberOfGuests}</td>
                                        <td>
                                            {res.status === 0 && <span className="badge bg-warning text-dark">Bekliyor</span>}
                                            {res.status === 1 && <span className="badge bg-success">Onaylı</span>}
                                            {res.status === 2 && <span className="badge bg-danger">Red</span>}
                                            {res.status === 3 && <span className="badge bg-secondary">İptal</span>}
                                        </td>
                                        <td>
                                            {res.status === 0 && (
                                                <div className="btn-group btn-group-sm">
                                                    <button onClick={() => handleStatusChange(res, 1)} className="btn btn-success" title="Onayla"><i className="fas fa-check"></i></button>
                                                    <button onClick={() => handleStatusChange(res, 2)} className="btn btn-danger" title="Reddet"><i className="fas fa-times"></i></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {reservations.length === 0 && <tr><td colSpan="6" className="text-center py-4">Henüz rezervasyon yok.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/*TAB 2: SALON DURUMU*/}
            {activeTab === 'liveMap' && (
                <div>
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
                </div>
            )}

            {/* MASA DETAY MODALI */}
            {selectedTableData && (
                <TableDetailModal
                    table={selectedTableData.table}
                    activeOrder={selectedTableData.order}
                    onClose={() => setSelectedTableData(null)}
                    onUpdate={() => {
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}

export default AdminDashboard;