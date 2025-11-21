import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';

function UserOrderDetailModal({ orderId, onClose }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await orderService.getOrderDetails(orderId);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                toast.error("Sipariş detayları yüklenemedi.");
                onClose();
            }
        };
        loadData();
    }, [orderId, onClose]);

    if (loading) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">Sipariş Detayı #{order.orderNum || order.id}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">

                        {/* Sipariş Bilgi Kartı */}
                        <div className="alert alert-light border mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span><strong>Tarih:</strong> {new Date(order.orderDate).toLocaleString('tr-TR')}</span>
                                <span>
                                    {order.orderState === 1 ? <span className="badge bg-success">Tamamlandı</span> :
                                        order.orderState === 2 ? <span className="badge bg-danger">İptal</span> :
                                            <span className="badge bg-warning text-dark">İşlemde</span>}
                                </span>
                            </div>
                            <div className="small text-muted">
                                <i className="fas fa-map-marker-alt me-1"></i> {order.address}, {order.city}
                            </div>
                            {order.orderNote && (
                                <div className="small text-danger mt-1">
                                    <i className="fas fa-sticky-note me-1"></i> Not: {order.orderNote}
                                </div>
                            )}
                        </div>

                        {/* Ürün Listesi */}
                        <h6 className="border-bottom pb-2 mb-3">Sepet İçeriği</h6>
                        <ul className="list-group list-group-flush">
                            {order.items?.map((item, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div>
                                        <span className="fw-bold">{item.quantity}x</span> {item.productName}
                                    </div>
                                    <span className="text-muted">{item.totalPrice} ₺</span>
                                </li>
                            ))}
                        </ul>

                    </div>
                    <div className="modal-footer bg-light">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <span className="text-muted">Toplam Tutar:</span>
                            <span className="fs-4 fw-bold text-success">{order.totalAmount} ₺</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserOrderDetailModal;