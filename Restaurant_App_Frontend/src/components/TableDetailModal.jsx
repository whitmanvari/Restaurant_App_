import React, { useEffect, useState } from 'react';
import { orderInRestaurantService } from '../services/orderInRestaurantService';
import { productService } from '../services/productService';
import { toast } from 'react-toastify';

function TableDetailModal({ table, activeOrder, onClose, onUpdate }) {
    const [orderDetails, setOrderDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadData();
    }, [activeOrder]);

    const loadData = async () => {
        try {
            const [orderData, productsData] = await Promise.all([
                orderInRestaurantService.getOrderDetails(activeOrder.id),
                productService.getAll()
            ]);
            setOrderDetails(orderData);
            setProducts(productsData);
            setLoading(false);
        } catch (error) {
            toast.error("Masa detayları yüklenemedi.");
            onClose();
        }
    };

    const handleAddItem = async () => {
        if (!selectedProductId) return;
        const product = products.find(p => p.id === parseInt(selectedProductId));
        if (!product) return;

        try {
            await orderInRestaurantService.addOrderItem(activeOrder.id, {
                productId: product.id,
                quantity: parseInt(quantity),
                price: product.price,
                productName: product.name 
            });
            toast.success("Ürün eklendi.");
            setShowAddProduct(false);
            loadData();
            onUpdate();
        } catch (error) {
            toast.error("Ürün eklenemedi.");
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm("Bu ürünü silmek istiyor musunuz?")) return;
        try {
            await orderInRestaurantService.removeOrderItem(activeOrder.id, itemId);
            toast.success("Ürün silindi.");
            loadData();
            onUpdate();
        } catch (error) {
            toast.error("Silme işlemi başarısız.");
        }
    };

    const handleCloseAccount = async () => {
        if (!window.confirm(`Toplam ${orderDetails?.totalAmount} ₺ tahsil edildi mi?`)) return;
        try {
            await orderInRestaurantService.closeOrder(activeOrder.id);
            toast.success("Masa hesabı kapatıldı.");
            onClose();
            onUpdate();
        } catch (error) {
            toast.error("İşlem başarısız.");
        }
    };

    if (!table || loading) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">Masa {table.tableNumber} Adisyonu</h5>
                        <button className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="table-responsive mb-4">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr><th>Ürün</th><th className="text-center">Adet</th><th className="text-end">Fiyat</th><th className="text-end">Toplam</th><th style={{ width: '50px' }}></th></tr>
                                </thead>
                                <tbody>
                                    {/* DTO'daki alan ismine dikkat: 'orderItems' */}
                                    {orderDetails?.orderItems?.map(item => ( 
                                        <tr key={item.id}>
                                            <td>{item.productName}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-end">{item.price} ₺</td>
                                            <td className="text-end fw-bold">{item.totalPrice} ₺</td>
                                            <td><button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleRemoveItem(item.id)}><i className="fas fa-times"></i></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="table-group-divider">
                                    <tr><td colSpan="3" className="text-end fw-bold">GENEL TOPLAM:</td><td className="text-end fw-bold fs-5 text-success">{orderDetails?.totalAmount} ₺</td><td></td></tr>
                                </tfoot>
                            </table>
                        </div>

                        {showAddProduct ? (
                            <div className="card bg-light border-0 p-3 mb-3">
                                <h6 className="mb-2">Hızlı Ürün Ekle</h6>
                                <div className="d-flex gap-2">
                                    <select className="form-select" value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
                                        <option value="">Ürün Seçiniz...</option>
                                        {products.map(p => (<option key={p.id} value={p.id}>{p.name} ({p.price} ₺)</option>))}
                                    </select>
                                    <input type="number" className="form-control" style={{ width: '80px' }} value={quantity} min="1" onChange={e => setQuantity(e.target.value)} />
                                    <button className="btn btn-success" onClick={handleAddItem}>Ekle</button>
                                    <button className="btn btn-outline-secondary" onClick={() => setShowAddProduct(false)}>İptal</button>
                                </div>
                            </div>
                        ) : (
                            <button className="btn btn-outline-dark w-100 mb-3 dashed-border" onClick={() => setShowAddProduct(true)}><i className="fas fa-plus me-2"></i> Sipariş Ekle</button>
                        )}
                    </div>
                    <div className="modal-footer justify-content-between">
                        <div className="text-muted small">
                            <i className="fas fa-info-circle me-1"></i>
                            {/* TARİH DÜZELTMESİ */}
                            Sipariş: #{activeOrder.id} | {new Date(activeOrder.orderDate).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}
                        </div>
                        <button className="btn btn-success px-4" onClick={handleCloseAccount}>Hesabı Kapat</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableDetailModal;