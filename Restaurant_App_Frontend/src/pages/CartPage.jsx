import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeProductFromCart } from '../store/slices/cartSlice'; 
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance'; // Masaları çekmek için

function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, totalAmount, status } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);

    const [orderType, setOrderType] = useState('delivery'); // 'delivery' (Eve) veya 'dinein' (Masa)
    const [tables, setTables] = useState([]);

    // Form State
    const [address, setAddress] = useState(user?.address || ''); // Varsa user adresini al
    const [selectedTableId, setSelectedTableId] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        dispatch(fetchCart());
        // Masaları çekelim (Dine-in seçeneği için)
        api.get('/Table').then(res => setTables(res.data));
    }, [dispatch]);

    const handleCheckout = async () => {
        if (items.length === 0) {
            toast.warning("Sepetiniz boş."); return;
        }

        try {
            if (orderType === 'delivery') {
                // --- EVE SİPARİŞ ---
                if (!address) { toast.warning("Lütfen teslimat adresi girin."); return; }

                const orderPayload = {
                    userId: user.id, // Backend claimden alıyor 
                    address: address,
                    city: user?.city || "İstanbul",
                    email: user.email,
                    phone: user.phoneNumber || "5555555555",
                    orderNote: note,
                    paymentId: "1", // Fake payment
                    items: items.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        price: i.price
                    })),
                    totalAmount: totalAmount
                };

                await orderService.createOrder(orderPayload);
                toast.success("Siparişiniz alındı! Yola çıkmak üzere.");

            } else {
                // --- MASAYA SİPARİŞ ---
                if (!selectedTableId) { toast.warning("Lütfen oturduğunuz masayı seçin."); return; }

                const tablePayload = {
                    tableId: parseInt(selectedTableId),
                    totalAmount: totalAmount,
                    status: "Pending",
                    orderItemsInRestaurant: items.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        price: i.price
                    }))
                };

                await orderService.createTableOrder(tablePayload);
                toast.success("Siparişiniz mutfağa iletildi. Afiyet olsun!");
            }

            // Başarılı ise yönlendir
            navigate('/my-orders'); 

        } catch (error) {
            console.error(error);
            toast.error("Sipariş oluşturulurken bir hata oluştu.");
        }
    };

    if (status === 'loading') return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <h2 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Sepetim</h2>

            <div className="row">
                {/* SOL: ÜRÜN LİSTESİ */}
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            {items.length === 0 ? (
                                <p className="text-center py-3">Sepetinizde ürün bulunmamaktadır.</p>
                            ) : (
                                items.map(item => (
                                    <div key={item.productId} className="d-flex justify-content-between align-items-center border-bottom py-3">
                                        <div className="d-flex align-items-center">
                                            <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '8px', marginRight: '15px' }}>
                                                {/* Resim ekle bir ara */}
                                            </div>
                                            <div>
                                                <h6 className="mb-0">{item.productName}</h6>
                                                <small className="text-muted">{item.price} ₺ x {item.quantity}</small>
                                            </div>
                                        </div>
                                        <div className="fw-bold">
                                            {item.totalPrice} ₺
                                            {/* Silme butonu ekle bir ara */}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* SAĞ: ÖDEME VE SİPARİŞ TİPİ */}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 bg-light">
                        <h5 className="mb-3">Sipariş Tipi</h5>

                        {/* TİP SEÇİMİ TABLARI */}
                        <div className="btn-group w-100 mb-3" role="group">
                            <input
                                type="radio" className="btn-check" name="ordertype" id="delivery"
                                checked={orderType === 'delivery'} onChange={() => setOrderType('delivery')}
                            />
                            <label className="btn btn-outline-dark" htmlFor="delivery"><i className="fas fa-truck me-2"></i>Teslimat</label>

                            <input
                                type="radio" className="btn-check" name="ordertype" id="dinein"
                                checked={orderType === 'dinein'} onChange={() => setOrderType('dinein')}
                            />
                            <label className="btn btn-outline-dark" htmlFor="dinein"><i className="fas fa-utensils me-2"></i>Masaya</label>
                        </div>

                        {/*FORM ALANI */}
                        {orderType === 'delivery' ? (
                            <div className="mb-3 fade-in-up">
                                <label className="form-label small fw-bold">Teslimat Adresi</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Açık adresinizi giriniz..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                ></textarea>
                            </div>
                        ) : (
                            <div className="mb-3 fade-in-up">
                                <label className="form-label small fw-bold">Masa Seçimi</label>
                                <select
                                    className="form-select"
                                    value={selectedTableId}
                                    onChange={(e) => setSelectedTableId(e.target.value)}
                                >
                                    <option value="">Masa Seçiniz...</option>
                                    {tables.filter(t => t.isAvailable).map(t => ( // Sadece boş masalar
                                        <option key={t.id} value={t.id}>Masa {t.tableNumber} ({t.capacity} Kişilik)</option>
                                    ))}
                                </select>
                                <small className="text-muted d-block mt-1">* Sadece şu an restoranımızdaysanız seçiniz.</small>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label small">Sipariş Notu</label>
                            <input
                                type="text" className="form-control" placeholder="Örn: Soğansız olsun"
                                value={note} onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <hr />
                        <div className="d-flex justify-content-between mb-4">
                            <span className="fw-bold">Toplam Tutar</span>
                            <span className="fs-4 fw-bold text-success">{totalAmount} ₺</span>
                        </div>

                        <button className="btn btn-dark w-100 py-3" onClick={handleCheckout}>
                            Siparişi Tamamla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;