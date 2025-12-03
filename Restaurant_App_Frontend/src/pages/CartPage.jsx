import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeProductFromCart, updateCartItemQuantity } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';
import OrderSuccessModal from '../components/StatusPages/OrderSuccessModal';

function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux'tan verileri çekiyoruz. TotalAmount backend'den hesaplanıp geliyor.
    const { items, totalAmount, status } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);

    // UI State
    const [orderType, setOrderType] = useState('delivery');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [tables, setTables] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Başarı Modalı State'i
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Form Data
    const [address, setAddress] = useState(user?.address || '');
    const [selectedTableId, setSelectedTableId] = useState('');
    const [note, setNote] = useState('');
    const [cardInfo, setCardInfo] = useState({ holder: '', number: '', expiry: '', cvc: '' });

    useEffect(() => {
        dispatch(fetchCart());
        // Masaları çek
        api.get('/Table').then(res => setTables(res.data)).catch(err => console.error(err));
    }, [dispatch]);

    const handleQuantityChange = (productId, currentQty, change) => {
        const newQty = currentQty + change;
        if (newQty < 1) return;
        dispatch(updateCartItemQuantity({ productId, quantity: newQty }));
    };

    const handleRemoveItem = (productId) => {
        if (window.confirm("Ürünü sepetten çıkarmak istiyor musunuz?")) {
            dispatch(removeProductFromCart(productId));
            toast.info("Ürün çıkarıldı.");
        }
    };

    const handleCheckout = async () => {
        if (items.length === 0) { toast.warning("Sepetiniz boş."); return; }

        setIsSubmitting(true);
        try {
            if (orderType === 'delivery') {
                // --- PAKET SİPARİŞ ---
                if (!address) { toast.warning("Lütfen adres giriniz."); setIsSubmitting(false); return; }

                const orderPayload = {
                    userId: user.id,
                    address: address,
                    city: user?.city || "İstanbul",
                    email: user.email,
                    phone: user.phoneNumber || "5555555555",
                    orderNote: note,
                    paymentId: "CC_PAID",
                    items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
                    totalAmount: totalAmount
                };
                await orderService.createOrder(orderPayload);
            } else {
                // --- MASA SİPARİŞİ ---
                if (!selectedTableId) { toast.warning("Lütfen masa seçiniz."); setIsSubmitting(false); return; }

                const tablePayload = {
                    tableId: parseInt(selectedTableId),
                    totalAmount: totalAmount,
                    status: "Pending",
                    userId: user.id,
                    orderItems: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
                };
                await orderService.createTableOrder(tablePayload);
            }

            // BAŞARILI OLUNCA:
            dispatch(clearCart()); // Sepeti temizle
            setShowSuccessModal(true); // MODALI AÇ

        } catch (error) {
            console.error(error);
            toast.error("Sipariş oluşturulamadı.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            {/* MODAL BİLEŞENİ */}
            <OrderSuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} />

            <div className="row g-5">

                {/* SOL: ÜRÜN LİSTESİ */}
                <div className="col-lg-8">
                    <h4 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Alışveriş Sepetim</h4>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">Ürün</th>
                                        <th className="text-center">Birim</th>
                                        <th className="text-center">Adet</th>
                                        <th className="text-end pe-4">Toplam</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => (
                                        <tr key={item.productId}>
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={getImageUrl(item.imageUrl)}
                                                        alt={item.productName}
                                                        className="rounded"
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                                                    />
                                                    <h6 className="mb-0 fw-bold">{item.productName}</h6>
                                                </div>
                                            </td>
                                            <td className="text-center text-muted">
                                                {item.price} ₺
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group btn-group-sm border rounded">
                                                    <button
                                                        className="btn btn-light"
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                                                        disabled={item.quantity <= 1}
                                                    >-</button>
                                                    <button className="btn btn-white fw-bold px-3" disabled>
                                                        {item.quantity}
                                                    </button>
                                                    <button
                                                        className="btn btn-light"
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                                                    >+</button>
                                                </div>
                                            </td>
                                            <td className="text-end pe-4 fw-bold text-dark">
                                                {item.totalPrice} ₺
                                            </td>
                                            <td className="text-end">
                                                <button className="btn btn-link text-danger p-0" onClick={() => handleRemoveItem(item.productId)}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr><td colSpan="5" className="text-center py-5 text-muted">Sepetiniz boş.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Link to="/menu" className="text-decoration-none text-muted">
                        <i className="fas fa-arrow-left me-2"></i> Alışverişe Devam Et
                    </Link>
                </div>

                {/* SAĞ: ÖDEME VE SİPARİŞ BİLGİLERİ */}
                {items.length > 0 && (
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-lg p-4 bg-white sticky-top" style={{ top: '100px' }}>
                            <h5 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Sipariş Detayları</h5>

                            <div className="bg-light p-1 rounded mb-4 d-flex">
                                <button
                                    className={`btn flex-fill ${orderType === 'delivery' ? 'btn-white shadow-sm fw-bold' : 'text-muted'}`}
                                    onClick={() => setOrderType('delivery')}
                                >
                                    <i className="fas fa-motorcycle me-2"></i> Eve Teslim
                                </button>
                                <button
                                    className={`btn flex-fill ${orderType === 'dinein' ? 'btn-white shadow-sm fw-bold' : 'text-muted'}`}
                                    onClick={() => setOrderType('dinein')}
                                >
                                    <i className="fas fa-utensils me-2"></i> Restoranda
                                </button>
                            </div>

                            {/* Form Alanları */}
                            <div className="mb-4">
                                {orderType === 'delivery' ? (
                                    <>
                                        <label className="form-label small fw-bold text-uppercase text-muted">Teslimat Adresi</label>
                                        <textarea
                                            className="form-control bg-light border-0"
                                            rows="3"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Açık adres..."
                                        ></textarea>
                                    </>
                                ) : (
                                    <>
                                        <label className="form-label small fw-bold text-uppercase text-muted">Masa Seçimi</label>
                                        <select
                                            className="form-select bg-light border-0 py-3"
                                            value={selectedTableId}
                                            onChange={(e) => setSelectedTableId(e.target.value)}
                                        >
                                            <option value="">Masa Seçiniz...</option>
                                            {tables.filter(t => t.isAvailable).map(t => (
                                                <option key={t.id} value={t.id}>{t.tableNumber} ({t.capacity} Kişilik)</option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>

                            {/* Kredi Kartı Formu (Sadece Delivery) */}
                            {orderType === 'delivery' && (
                                <div className="mb-4">
                                    <h6 className="mb-3 small fw-bold text-uppercase text-muted">Ödeme</h6>
                                    <div className="bg-light p-3 rounded border">
                                        {/* Kart inputları */}
                                        <input type="text" className="form-control form-control-sm mb-2" placeholder="Kart No" maxLength="16" value={cardInfo.number} onChange={e => setCardInfo({ ...cardInfo, number: e.target.value })} />
                                        <div className="row g-2">
                                            <div className="col-6"><input type="text" className="form-control form-control-sm" placeholder="AA/YY" maxLength="5" value={cardInfo.expiry} onChange={e => setCardInfo({ ...cardInfo, expiry: e.target.value })} /></div>
                                            <div className="col-6"><input type="text" className="form-control form-control-sm" placeholder="CVC" maxLength="3" value={cardInfo.cvc} onChange={e => setCardInfo({ ...cardInfo, cvc: e.target.value })} /></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GENEL TOPLAM GÖSTERGESİ */}
                            <div className="d-flex justify-content-between mb-4 align-items-center border-top pt-3">
                                <span className="text-muted">Genel Toplam</span>
                                <span className="fs-2 fw-bold text-success">{totalAmount} ₺</span>
                            </div>

                            <button
                                className="btn btn-dark w-100 py-3 text-uppercase fw-bold"
                                style={{ letterSpacing: '1px' }}
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'İşleniyor...' : (orderType === 'delivery' ? 'Ödemeyi Tamamla' : 'Siparişi Mutfağa Gönder')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartPage;