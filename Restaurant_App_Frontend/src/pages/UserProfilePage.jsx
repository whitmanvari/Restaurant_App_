import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { orderService } from '../services/orderService';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import UserOrderDetailModal from '../components/StatusPages/UserOrderDetailModal';

export default function UserProfilePage({ isAdminView = false }) {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        if (!isAdminView) { // Admin panelinde ayarlar kısmındaysa sipariş çekme
            fetchOrders();
        }
    }, [isAdminView]);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            // Tarihe göre yeniden eskiye sırala
            setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
        } catch (error) {
            console.error("Siparişler alınamadı", error);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="badge bg-warning text-dark">Onay Bekliyor</span>;
            case 1: return <span className="badge bg-success">Tamamlandı</span>;
            case 2: return <span className="badge bg-danger">İptal</span>;
            case 3: return <span className="badge bg-info text-white">Hazırlanıyor</span>;
            default: return <span className="badge bg-secondary">Bilinmiyor</span>;
        }
    };

    return (
        <div className="container mt-5 pt-5 mb-5">
            {selectedOrderId && (
                <UserOrderDetailModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
            )}

            <div className="row g-4">
                {/* SOL: Profil Kartı */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm text-center p-4">
                        <div className="mb-3 d-flex justify-content-center">
                            <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center display-4 fw-bold" style={{ width: '100px', height: '100px' }}>
                                {user?.fullName ? user.fullName.substring(0, 1).toUpperCase() : 'U'}
                            </div>
                        </div>
                        <h4 className="fw-bold">{user?.fullName}</h4>
                        <p className="text-muted mb-4">{user?.email}</p>
                        
                        {!isAdminView && (
                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-dark">Bilgilerimi Güncelle</button>
                                <button className="btn btn-danger" onClick={handleLogout}>Çıkış Yap</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* SAĞ: Geçmiş Siparişler (Sadece User Modunda) */}
                {!isAdminView && (
                    <div className="col-lg-8">
                        <h3 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Geçmiş Siparişler</h3>
                        
                        {orders.length === 0 ? (
                            <div className="alert alert-light border">Henüz siparişiniz bulunmuyor.</div>
                        ) : (
                            <div className="card border-0 shadow-sm">
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
                                                        {/* Sipariş Numarasını Kısalt */}
                                                        <span title={order.orderNum}>
                                                            {order.orderNum ? order.orderNum.substring(0, 12) + '...' : `#${order.id}`}
                                                        </span>
                                                    </td>
                                                    <td className="text-muted small">
                                                        {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                                                        <br />
                                                        {new Date(order.orderDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                                    </td>
                                                    <td className="fw-bold text-success">
                                                        {order.totalAmount} ₺
                                                    </td>
                                                    <td>{getStatusBadge(order.orderState)}</td>
                                                    <td className="text-end pe-3">
                                                        <button 
                                                            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                                            onClick={() => setSelectedOrderId(order.id)}
                                                        >
                                                            Detay
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Admin Ayarlar Modu */}
                {isAdminView && (
                    <div className="col-lg-8">
                        <div className="alert alert-info">
                            <i className="fas fa-info-circle me-2"></i>
                            Yönetici profili düzenleme özellikleri yakında eklenecektir.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}