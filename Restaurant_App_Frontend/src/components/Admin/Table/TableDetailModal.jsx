import React, { useEffect, useState } from 'react';
import { orderInRestaurantService } from '../../../services/orderInRestaurantService';
import { productService } from '../../../services/productService';
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
            toast.error("Detaylar yüklenemedi.");
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
                price: product.price
            });
            toast.success("Ürün eklendi.");
            setShowAddProduct(false);
            
            //Hem modal içindeki veriyi hem de dashboard'u yenile
            await loadData(); 
            if (onUpdate) onUpdate(); 
            
        } catch (error) {
            toast.error("Ürün eklenirken hata oluştu.");
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
        try {
            await orderInRestaurantService.removeOrderItem(activeOrder.id, itemId);
            toast.success("Ürün silindi.");
            await loadData();
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error("Silme hatası.");
        }
    };

    const handleCloseAccount = async () => {
        if (!window.confirm(`Toplam ${orderDetails?.totalAmount} ₺ tahsil edildi mi?`)) return;
        try {
            await orderInRestaurantService.closeOrder(activeOrder.id);
            toast.success("Masa kapatıldı.");
            onClose();
            if (onUpdate) onUpdate();
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
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Ürün Listesi */}
                        <table className="table table-hover align-middle mb-3">
                            <thead className="table-light">
                                <tr><th>Ürün</th><th className="text-center">Adet</th><th className="text-end">Fiyat</th><th className="text-end">Toplam</th><th></th></tr>
                            </thead>
                            <tbody>
                                {orderDetails?.orderItems?.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.productName}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-end">{item.price} ₺</td>
                                        <td className="text-end fw-bold">{item.totalPrice} ₺</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleRemoveItem(item.id)}><i className="fas fa-times"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="table-group-divider">
                                <tr><td colSpan="3" className="text-end fw-bold">GENEL TOPLAM:</td><td className="text-end fw-bold fs-5 text-success">{orderDetails?.totalAmount} ₺</td><td></td></tr>
                            </tfoot>
                        </table>

                        {/* Ekleme Formu */}
                        {showAddProduct ? (
                            <div className="card bg-light border-0 p-3">
                                <div className="d-flex gap-2">
                                    <select className="form-select" value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
                                        <option value="">Ürün Seçiniz...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.price} ₺)</option>)}
                                    </select>
                                    <input type="number" className="form-control" style={{width:'80px'}} value={quantity} min="1" onChange={e => setQuantity(e.target.value)} />
                                    <button className="btn btn-success" onClick={handleAddItem}>Ekle</button>
                                    <button className="btn btn-outline-secondary" onClick={() => setShowAddProduct(false)}>İptal</button>
                                </div>
                            </div>
                        ) : (
                            <button className="btn btn-outline-dark w-100 dashed-border" onClick={() => setShowAddProduct(true)}>+ Ürün Ekle</button>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-success px-4" onClick={handleCloseAccount}>Hesabı Kapat</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableDetailModal;