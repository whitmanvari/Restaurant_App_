import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';

function AdminOrdersPage() {
    const [onlineOrders, setOnlineOrders] = useState([]);
    const [tableOrders, setTableOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('online'); // 'online' | 'table'

    useEffect(() => {
        fetchAllData();
        // 30 saniyede bir otomatik yenileme (Canlı mutfak ekranı)
        const interval = setInterval(fetchAllData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            const [online, table] = await Promise.all([
                orderService.getAllOnlineOrders(),
                orderService.getAllTableOrders()
            ]);
            // Yeniden eskiye sırala
            setOnlineOrders(online.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
            setTableOrders(table.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
            setLoading(false);
        } catch (error) {
            console.error(error);
            // Sessiz hata
        }
    };

    // --- ONLINE SİPARİŞ DURUM GÜNCELLEME ---
    const handleOnlineStatus = async (id, status) => {
        try {
            await orderService.updateOnlineOrderStatus(id, status);
            toast.success("Durum güncellendi.");
            fetchAllData();
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    // --- MASA SİPARİŞ DURUM GÜNCELLEME ---
    const handleTableStatus = async (id, statusStr) => {
        try {
            await orderService.updateTableOrderStatus(id, statusStr);
            toast.success("Masa durumu güncellendi.");
            fetchAllData();
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    // Yardımcı: Online Durum Rozeti
    const getOnlineBadge = (status) => {
        switch (status) {
            case 0: return <span className="badge bg-warning text-dark">Bekliyor</span>;
            case 3: return <span className="badge bg-info text-dark">Hazırlanıyor</span>;
            case 1: return <span className="badge bg-success">Tamamlandı</span>;
            case 2: return <span className="badge bg-danger">İptal</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'Playfair Display' }}>Sipariş Yönetimi</h2>
                <div className="btn-group">
                    <button
                        className={`btn ${activeTab === 'online' ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setActiveTab('online')}
                    >
                        <i className="fas fa-truck me-2"></i> Paket Servis
                    </button>
                    <button
                        className={`btn ${activeTab === 'table' ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setActiveTab('table')}
                    >
                        <i className="fas fa-utensils me-2"></i> Masa Servis
                    </button>
                </div>
            </div>

            {/* TAB 1: ONLINE SİPARİŞLER */}
            {activeTab === 'online' && (
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Sipariş ID</th>
                                    <th>Müşteri & Adres</th>
                                    <th>Tutar</th>
                                    <th>Durum</th>
                                    <th>İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {onlineOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.orderNum || order.id}</td>
                                        <td>
                                            <div className="fw-bold">{order.email}</div> {/* İsim yoksa email */}
                                            <small className="text-muted d-block">{order.city}, {order.address}</small>
                                            {order.orderNote && <small className="text-danger fst-italic">Not: {order.orderNote}</small>}
                                        </td>
                                        <td className="fw-bold">{order.totalAmount} ₺</td>
                                        <td>{getOnlineBadge(order.orderState)}</td>
                                        <td>
                                            {order.orderState === 0 && (
                                                <button onClick={() => handleOnlineStatus(order.id, 3)} className="btn btn-sm btn-info me-2">Hazırla</button>
                                            )}
                                            {order.orderState === 3 && (
                                                <button onClick={() => handleOnlineStatus(order.id, 1)} className="btn btn-sm btn-success me-2">Tamamla</button>
                                            )}
                                            {order.orderState !== 1 && order.orderState !== 2 && (
                                                <button onClick={() => handleOnlineStatus(order.id, 2)} className="btn btn-sm btn-outline-danger">İptal</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: MASA SİPARİŞLERİ */}
            {activeTab === 'table' && (
                <div className="row g-3">
                    {tableOrders.map(order => (
                        <div key={order.id} className="col-md-6 col-lg-4">
                            <div className={`card h-100 border-0 shadow-sm ${order.status === 'Pending' ? 'border-start border-4 border-warning' : ''}`}>
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">Masa {order.tableNumber}</span>
                                    <span className={`badge ${order.status === 'Served' ? 'bg-success' : 'bg-warning text-dark'}`}>{order.status}</span>
                                </div>
                                <div className="card-body">
                                    <ul className="list-unstyled mb-3">
                                        {order.orderItemsInRestaurant?.map((item, idx) => (
                                            <li key={idx} className="d-flex justify-content-between border-bottom py-1">
                                                <span>{item.quantity}x {item.productName}</span>
                                                <span className="fw-bold">{item.price * item.quantity} ₺</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <h5 className="text-end text-success">{order.totalAmount} ₺</h5>
                                </div>
                                <div className="card-footer bg-white">
                                    <div className="d-flex gap-2 justify-content-end">
                                        {order.status === 'Pending' && (
                                            <button onClick={() => handleTableStatus(order.id, 'InProgress')} className="btn btn-sm btn-info text-white">Hazırla</button>
                                        )}
                                        {order.status === 'InProgress' && (
                                            <button onClick={() => handleTableStatus(order.id, 'Served')} className="btn btn-sm btn-primary">Servis Et</button>
                                        )}
                                        {order.status === 'Served' && (
                                            <button onClick={() => handleTableStatus(order.id, 'Completed')} className="btn btn-sm btn-success">Hesabı Kapat</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminOrdersPage;