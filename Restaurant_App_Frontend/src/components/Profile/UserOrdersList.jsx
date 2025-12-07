import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import UserOrderDetailModal from '../StatusPages/UserOrderDetailModal';

export default function UserOrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
                setLoading(false);
            } catch (error) {
                console.error("Siparişler alınamadı", error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="badge bg-warning text-dark">Onay Bekliyor</span>;
            case 1: return <span className="badge bg-success">Tamamlandı</span>;
            case 2: return <span className="badge bg-danger">İptal</span>;
            case 3: return <span className="badge bg-info text-white">Hazırlanıyor</span>;
            default: return <span className="badge bg-secondary">Bilinmiyor</span>;
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-muted"></div></div>;

    return (
        <>
            {selectedOrderId && <UserOrderDetailModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />}
            
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                    <h5 className="mb-0" style={{ fontFamily: 'Playfair Display' }}>Geçmiş Siparişler</h5>
                </div>
                <div className="card-body p-0">
                    {orders.length === 0 ? (
                        <div className="p-4 text-center text-muted">Henüz siparişiniz bulunmuyor.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">Sipariş No</th>
                                        <th>Tarih</th>
                                        <th>Tutar</th>
                                        <th>Durum</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="ps-4 fw-bold text-dark">
                                                <span title={order.orderNum}>
                                                    {order.orderNum ? order.orderNum.substring(0, 10) + '...' : `#${order.id}`}
                                                </span>
                                            </td>
                                            <td className="text-muted small">
                                                {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="fw-bold text-success">{order.totalAmount} ₺</td>
                                            <td>{getStatusBadge(order.orderState)}</td>
                                            <td className="text-end pe-3">
                                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => setSelectedOrderId(order.id)}>
                                                    Detay
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}