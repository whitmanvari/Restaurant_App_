import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { toast } from 'react-toastify';

function AdminOrdersPage() {
    const [onlineOrders, setOnlineOrders] = useState([]);
    const [tableOrders, setTableOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('online'); // 'online' | 'table'

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 15000); // 15 saniyede bir yenile
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            const [online, table] = await Promise.all([
                orderService.getAllOnlineOrders(),
                orderService.getAllTableOrders()
            ]);
            // Tarihe göre sırala (En yeni en üstte)
            setOnlineOrders(online.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
            setTableOrders(table.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    // ONLINE SİPARİŞ AKSİYONLARI
    const handleOnlineStatus = async (id, status) => {
        try {
            await orderService.updateOnlineOrderStatus(id, status);
            toast.success("Durum güncellendi.");
            fetchAllData();
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    // MASA SİPARİŞ AKSİYONLARI
    const handleTableStatus = async (id, statusStr) => {
        try {
            await orderService.updateTableOrderStatus(id, statusStr);
            toast.success("Masa durumu güncellendi.");
            fetchAllData();
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'Playfair Display' }}>Sipariş Yönetimi</h2>
                <div className="btn-group">
                    <button className={`btn ${activeTab === 'online' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('online')}>
                        <i className="fas fa-truck me-2"></i> Paket ({onlineOrders.filter(o => o.orderState === 0).length})
                    </button>
                    <button className={`btn ${activeTab === 'table' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('table')}>
                        <i className="fas fa-utensils me-2"></i> Masa ({tableOrders.filter(o => o.status === 'Pending').length})
                    </button>
                </div>
            </div>

            {/* ONLINE SİPARİŞ LİSTESİ */}
            {activeTab === 'online' && (
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Sipariş No</th>
                                    <th>Müşteri</th>
                                    <th>Adres</th>
                                    <th>Tutar</th>
                                    <th>Durum</th>
                                    <th className="text-end">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {onlineOrders.map(order => (
                                    <tr key={order.id} className={order.orderState === 0 ? 'table-warning' : ''}>
                                        <td className="fw-bold">#{order.orderNum || order.id}</td>
                                        <td>{order.email}</td>
                                        <td>{order.city}, {order.address}</td>
                                        <td className="fw-bold">{order.totalAmount} ₺</td>
                                        <td>
                                            {order.orderState === 0 && <span className="badge bg-warning text-dark">Bekliyor</span>}
                                            {order.orderState === 3 && <span className="badge bg-info text-dark">Hazırlanıyor</span>}
                                            {order.orderState === 1 && <span className="badge bg-success">Tamamlandı</span>}
                                            {order.orderState === 2 && <span className="badge bg-danger">İptal</span>}
                                        </td>
                                        <td className="text-end">
                                            {order.orderState === 0 && <button onClick={() => handleOnlineStatus(order.id, 3)} className="btn btn-sm btn-info me-1">Hazırla</button>}
                                            {order.orderState === 3 && <button onClick={() => handleOnlineStatus(order.id, 1)} className="btn btn-sm btn-success me-1">Yola Çıkar</button>}
                                            {order.orderState < 1 && <button onClick={() => handleOnlineStatus(order.id, 2)} className="btn btn-sm btn-outline-danger">Reddet</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MASA SİPARİŞ KARTLARI */}
            {activeTab === 'table' && (
                <div className="row g-3">
                    {tableOrders.map(order => (
                        <div key={order.id} className="col-md-6 col-lg-4">
                            <div className={`card h-100 shadow-sm border-${order.status === 'Pending' ? 'warning' : 'secondary'} border-2`}>
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <span className="fw-bold fs-5">Masa {order.tableNumber}</span>
                                    <span className="badge bg-light text-dark border">{order.status}</span>
                                </div>
                                <div className="card-body">
                                    <ul className="list-unstyled mb-3">
                                        {order.orderItemsInRestaurant?.map((item, idx) => (
                                            <li key={idx} className="d-flex justify-content-between border-bottom py-1">
                                                <span>{item.quantity}x {item.productName}</span>
                                                <span>{item.totalPrice} ₺</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <h4 className="text-end text-success">{order.totalAmount} ₺</h4>
                                </div>
                                <div className="card-footer bg-white text-end">
                                    {order.status === 'Pending' && <button onClick={() => handleTableStatus(order.id, 'InProgress')} className="btn btn-primary btn-sm">Siparişi Başlat</button>}
                                    {order.status === 'InProgress' && <button onClick={() => handleTableStatus(order.id, 'Served')} className="btn btn-info btn-sm text-white">Servis Et</button>}
                                    {order.status === 'Served' && <button onClick={() => handleTableStatus(order.id, 'Completed')} className="btn btn-success btn-sm">Hesabı Kapat</button>}
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