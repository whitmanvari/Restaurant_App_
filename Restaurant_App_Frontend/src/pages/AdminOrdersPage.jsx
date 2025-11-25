import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';

function AdminOrdersPage() {
    const [onlineOrders, setOnlineOrders] = useState([]);
    const [tableOrders, setTableOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('online');

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            const [online, table] = await Promise.all([
                orderService.getAllOnlineOrders(),
                orderService.getAllTableOrders()
            ]);
            setOnlineOrders(online.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
            setTableOrders(table.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
            setLoading(false);
        } catch (error) { console.error(error); }
    };

    const handleOnlineStatus = async (id, status) => {
        try { await orderService.updateOnlineOrderStatus(id, status); toast.success("Güncellendi"); fetchAllData(); } 
        catch { toast.error("Hata."); }
    };

    const handleTableStatus = async (id, statusStr) => {
        try { await orderService.updateTableOrderStatus(id, statusStr); toast.success("Güncellendi"); fetchAllData(); } 
        catch { toast.error("Hata."); }
    };

    const getBadge = (status, type) => {
        if (type === 'online') {
            if(status === 0) return <span className="badge bg-warning text-dark">Bekliyor</span>;
            if(status === 3) return <span className="badge bg-info text-dark">Hazırlanıyor</span>;
            if(status === 1) return <span className="badge bg-success">Tamamlandı</span>;
            return <span className="badge bg-danger">İptal</span>;
        } else {
            if(status === 'Pending') return <span className="badge bg-warning text-dark">Sipariş Alındı</span>;
            if(status === 'InProgress') return <span className="badge bg-info text-dark">Hazırlanıyor</span>;
            if(status === 'Served') return <span className="badge bg-primary">Servis Edildi</span>;
            return <span className="badge bg-success">Kapatıldı</span>;
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Sipariş Takibi</h2>
                <div className="btn-group">
                    <button className={`btn ${activeTab === 'online' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('online')}><i className="fas fa-truck me-2"></i> Paket</button>
                    <button className={`btn ${activeTab === 'table' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('table')}><i className="fas fa-utensils me-2"></i> Masa</button>
                </div>
            </div>

            {activeTab === 'online' && (
                <div className="card border-0 shadow-sm" style={{backgroundColor: 'var(--bg-card)'}}>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0" style={{color: 'var(--text-main)'}}>
                            <thead className="bg-light"><tr><th>ID</th><th>Müşteri</th><th>Tutar</th><th>Durum</th><th>İşlem</th></tr></thead>
                            <tbody>
                                {onlineOrders.map(order => (
                                    <tr key={order.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                                        <td className="fw-bold">#{order.orderNum || order.id}</td>
                                        <td><div className="fw-bold">{order.email}</div><small className="text-muted">{order.address}</small></td>
                                        <td className="fw-bold">{order.totalAmount} ₺</td>
                                        <td>{getBadge(order.orderState, 'online')}</td>
                                        <td>
                                            {order.orderState === 0 && <button onClick={() => handleOnlineStatus(order.id, 3)} className="btn btn-sm btn-info me-1">Hazırla</button>}
                                            {order.orderState === 3 && <button onClick={() => handleOnlineStatus(order.id, 1)} className="btn btn-sm btn-success me-1">Bitir</button>}
                                            {order.orderState < 1 && <button onClick={() => handleOnlineStatus(order.id, 2)} className="btn btn-sm btn-outline-danger">İptal</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'table' && (
                <div className="row g-3">
                    {tableOrders.map(order => (
                        <div key={order.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm" style={{backgroundColor: 'var(--bg-card)', borderLeft: order.status === 'Pending' ? '4px solid #ffc107' : 'none'}}>
                                <div className="card-header bg-transparent d-flex justify-content-between fw-bold" style={{color: 'var(--text-main)'}}>
                                    <span>Masa {order.tableNumber}</span>
                                    {getBadge(order.status, 'table')}
                                </div>
                                <div className="card-body" style={{color: 'var(--text-main)'}}>
                                    <ul className="list-unstyled mb-3">
                                        {order.orderItemsInRestaurant?.map((item, i) => (
                                            <li key={i} className="d-flex justify-content-between border-bottom py-1 border-light">
                                                <span>{item.quantity}x {item.productName}</span>
                                                <span>{item.totalPrice} ₺</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <h5 className="text-end text-success">{order.totalAmount} ₺</h5>
                                </div>
                                <div className="card-footer bg-transparent text-end">
                                    {order.status === 'Pending' && <button onClick={() => handleTableStatus(order.id, 'InProgress')} className="btn btn-sm btn-info text-white">Başla</button>}
                                    {order.status === 'InProgress' && <button onClick={() => handleTableStatus(order.id, 'Served')} className="btn btn-sm btn-primary">Servis</button>}
                                    {order.status === 'Served' && <button onClick={() => handleTableStatus(order.id, 'Completed')} className="btn btn-sm btn-success">Kapat</button>}
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