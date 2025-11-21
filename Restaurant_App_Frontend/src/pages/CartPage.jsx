import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeProductFromCart } from '../store/slices/cartSlice'; 
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance'; 
import { getImageUrl } from '../utils/imageHelper';

function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, totalAmount, status } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);

    const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'dinein'
    const [tables, setTables] = useState([]);

    // Form State
    const [address, setAddress] = useState(user?.address || '');
    const [selectedTableId, setSelectedTableId] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        dispatch(fetchCart());
        api.get('/Table').then(res => setTables(res.data));
    }, [dispatch]);

    const handleRemoveItem = (productId) => {
        if(window.confirm("Bu ürünü sepetten çıkarmak istiyor musunuz?")){
            dispatch(removeProductFromCart(productId));
        }
    };

    const handleCheckout = async () => {
        if (items.length === 0) { toast.warning("Sepetiniz boş."); return; }

        try {
            if (orderType === 'delivery') {
                if (!address) { toast.warning("Lütfen teslimat adresi girin."); return; }

                const orderPayload = {
                    userId: user.id,
                    address: address,
                    city: user?.city || "İstanbul",
                    email: user.email,
                    phone: user.phoneNumber || "5555555555",
                    orderNote: note,
                    paymentId: "1",
                    items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
                    totalAmount: totalAmount
                };

                await orderService.createOrder(orderPayload);
                toast.success("Siparişiniz alındı! Yola çıkmak üzere.");

            } else {
                if (!selectedTableId) { toast.warning("Lütfen oturduğunuz masayı seçin."); return; }

                const tablePayload = {
                    tableId: parseInt(selectedTableId),
                    totalAmount: totalAmount,
                    status: "Pending",
                    orderItemsInRestaurant: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
                };

                await orderService.createTableOrder(tablePayload);
                toast.success("Siparişiniz mutfağa iletildi. Afiyet olsun!");
            }
            navigate('/my-orders'); 

        } catch (error) {
            toast.error("Sipariş oluşturulurken bir hata oluştu.");
        }
    };

    if (status === 'loading') return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="text-center mb-5">
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '3rem' }}>Sepetim</h2>
                <p className="text-muted">Lezzet yolculuğunuzun son adımı</p>
            </div>

            <div className="row g-5">
                {/* SOL: ÜRÜN LİSTESİ */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <div className="card-body p-4">
                            {items.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-shopping-basket fa-3x text-muted mb-3 opacity-50"></i>
                                    <p className="text-muted">Sepetinizde henüz ürün yok.</p>
                                    <Link to="/menu" className="btn btn-outline-dark mt-2">Menüye Göz At</Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0" style={{ color: 'var(--text-main)' }}>
                                        <thead style={{ borderBottom: '2px solid var(--border-color)' }}>
                                            <tr>
                                                <th scope="col" className="py-3 ps-0">Ürün</th>
                                                <th scope="col" className="py-3 text-center">Adet</th>
                                                <th scope="col" className="py-3 text-end">Fiyat</th>
                                                <th scope="col" className="py-3 text-end">Toplam</th>
                                                <th scope="col" className="py-3 text-end"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map(item => (
                                                <tr key={item.productId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td className="ps-0 py-3">
                                                        <div className="d-flex align-items-center">
                                                            <img 
                                                                src={getImageUrl(item.imageUrl)} 
                                                                alt={item.productName} 
                                                                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }}
                                                            />
                                                            <div>
                                                                <h6 className="mb-0 fw-bold">{item.productName}</h6>
                                                                <small className="text-muted">Kategori: Lezzetler</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center py-3">
                                                        <span className="badge bg-light text-dark border px-3 py-2 fs-6">{item.quantity}</span>
                                                    </td>
                                                    <td className="text-end py-3 text-muted">{item.price} ₺</td>
                                                    <td className="text-end py-3 fw-bold" style={{ color: 'var(--accent-color)' }}>{item.totalPrice} ₺</td>
                                                    <td className="text-end py-3">
                                                        <button className="btn btn-sm text-danger p-0" onClick={() => handleRemoveItem(item.productId)} title="Sil">
                                                            <i className="fas fa-trash-alt"></i>
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
                    
                    {items.length > 0 && (
                        <div className="mt-3">
                            <Link to="/menu" className="text-decoration-none text-muted small">
                                <i className="fas fa-arrow-left me-2"></i> Alışverişe Devam Et
                            </Link>
                        </div>
                    )}
                </div>

                {/* SAĞ: ÖZET & ÖDEME */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '100px', backgroundColor: 'var(--bg-section-alt)' }}>
                        <h5 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Sipariş Detayları</h5>

                        {/* SİPARİŞ TİPİ SEÇİMİ */}
                        <div className="d-flex gap-2 mb-4 bg-white p-1 rounded border">
                            <button 
                                className={`btn flex-fill ${orderType === 'delivery' ? 'btn-dark' : 'btn-light text-muted'}`}
                                onClick={() => setOrderType('delivery')}
                            >
                                <i className="fas fa-motorcycle me-2"></i>Teslimat
                            </button>
                            <button 
                                className={`btn flex-fill ${orderType === 'dinein' ? 'btn-dark' : 'btn-light text-muted'}`}
                                onClick={() => setOrderType('dinein')}
                            >
                                <i className="fas fa-utensils me-2"></i>Masaya
                            </button>
                        </div>

                        {/* FORM ALANLARI */}
                        {orderType === 'delivery' ? (
                            <div className="mb-3 animate-fade-in">
                                <label className="form-label small fw-bold text-uppercase">Teslimat Adresi</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Cadde, sokak, bina no..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                ></textarea>
                            </div>
                        ) : (
                            <div className="mb-3 animate-fade-in">
                                <label className="form-label small fw-bold text-uppercase">Masa Numarası</label>
                                <select
                                    className="form-select"
                                    value={selectedTableId}
                                    onChange={(e) => setSelectedTableId(e.target.value)}
                                >
                                    <option value="">Masa Seçiniz...</option>
                                    {tables.filter(t => t.isAvailable).map(t => (
                                        <option key={t.id} value={t.id}>Masa {t.tableNumber} ({t.capacity} Kişi)</option>
                                    ))}
                                </select>
                                <div className="form-text small mt-1">* Restorandaysanız masanızı seçin.</div>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase">Sipariş Notu</label>
                            <input
                                type="text" className="form-control" placeholder="Örn: Zili çalmayın..."
                                value={note} onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

                        <div className="d-flex justify-content-between mb-2 text-muted">
                            <span>Ara Toplam</span>
                            <span>{totalAmount} ₺</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <span className="fw-bold fs-5">Genel Toplam</span>
                            <span className="fw-bold fs-4" style={{ color: 'var(--accent-color)' }}>{totalAmount} ₺</span>
                        </div>

                        <button 
                            className="btn btn-dark w-100 py-3 text-uppercase fw-bold" 
                            style={{ letterSpacing: '1px' }}
                            onClick={handleCheckout}
                            disabled={items.length === 0}
                        >
                            Siparişi Onayla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;