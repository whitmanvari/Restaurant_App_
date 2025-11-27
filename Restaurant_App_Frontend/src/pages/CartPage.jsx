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

    // UI State
    const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'dinein'
    const [paymentMethod, setPaymentMethod] = useState('credit_card'); // 'credit_card' | 'cash'
    const [tables, setTables] = useState([]);
    const [loadingTables, setLoadingTables] = useState(false);

    // Form Data
    const [address, setAddress] = useState(user?.address || '');
    const [selectedTableId, setSelectedTableId] = useState('');
    const [note, setNote] = useState('');
    
    // Fake Kredi Kartı State
    const [cardInfo, setCardInfo] = useState({ holder: '', number: '', expiry: '', cvc: '' });

    useEffect(() => {
        dispatch(fetchCart());
        // Masaları çek (Sadece dine-in seçilirse de çekilebilir ama hazır olsun)
        setLoadingTables(true);
        api.get('/Table').then(res => {
            setTables(res.data);
            setLoadingTables(false);
        });
    }, [dispatch]);

    const handleRemoveItem = (productId) => {
        dispatch(removeProductFromCart(productId));
        toast.info("Ürün sepetten çıkarıldı.");
    };

    const handleCheckout = async () => {
        if (items.length === 0) { toast.warning("Sepetiniz boş."); return; }

        // Kredi Kartı Validasyonu 
        if (paymentMethod === 'credit_card') {
            if (cardInfo.number.length < 16 || !cardInfo.holder || !cardInfo.cvc) {
                toast.warning("Lütfen kart bilgilerinizi eksiksiz giriniz.");
                return;
            }
        }

        try {
            if (orderType === 'delivery') {
                // --- PAKET SİPARİŞ ---
                if (!address) { toast.warning("Teslimat adresi zorunludur."); return; }

                const orderPayload = {
                    userId: user.id,
                    address: address,
                    city: user?.city || "İstanbul",
                    email: user.email,
                    phone: user.phoneNumber || "5555555555",
                    orderNote: note,
                    paymentId: paymentMethod === 'credit_card' ? "CC_PAID" : "CASH_ON_DELIVERY",
                    items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
                    totalAmount: totalAmount
                };

                await orderService.createOrder(orderPayload);
                toast.success("Siparişiniz alındı! Hazırlanmaya başlıyor.");

            } else {
                // --- MASAYA SİPARİŞ ---
                if (!selectedTableId) { toast.warning("Lütfen masa seçiniz."); return; }

                const tablePayload = {
                    tableId: parseInt(selectedTableId),
                    totalAmount: totalAmount,
                    status: "Pending", // Admin onayı bekleyecek
                    orderItemsInRestaurant: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
                };

                await orderService.createTableOrder(tablePayload);
                toast.success("Siparişiniz mutfağa iletildi. Afiyet olsun!");
            }
            
            navigate('/my-orders'); // Siparişlerim sayfasına yönlendir

        } catch (error) {
            toast.error("Sipariş oluşturulurken bir hata oluştu.");
        }
    };

    if (status === 'loading') return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="row g-5">
                
                {/* SOL: SEPET ÖZETİ */}
                <div className="col-lg-7">
                    <h4 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Sepetim ({items.length} Ürün)</h4>
                    
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-0">
                            {items.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-shopping-basket fa-3x text-muted mb-3 opacity-25"></i>
                                    <p className="text-muted">Sepetinizde henüz ürün yok.</p>
                                    <Link to="/menu" className="btn btn-outline-dark mt-2">Menüye Göz At</Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="ps-4">Ürün</th>
                                                <th className="text-center">Adet</th>
                                                <th className="text-end pe-4">Tutar</th>
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
                                                            <div>
                                                                <h6 className="mb-0 fw-bold">{item.productName}</h6>
                                                                <small className="text-muted">{item.price} ₺</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-light text-dark border px-3 py-2">{item.quantity}</span>
                                                    </td>
                                                    <td className="text-end pe-4 fw-bold">{item.totalPrice} ₺</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-link text-danger p-0" onClick={() => handleRemoveItem(item.productId)}>
                                                            <i className="fas fa-times"></i>
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
                    
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to="/menu" className="text-decoration-none text-muted">
                            <i className="fas fa-arrow-left me-2"></i> Alışverişe Devam Et
                        </Link>
                        {items.length > 0 && (
                             <div className="text-end">
                                 <span className="text-muted me-3">Ara Toplam:</span>
                                 <span className="fs-4 fw-bold text-dark">{totalAmount} ₺</span>
                             </div>
                        )}
                    </div>
                </div>

                {/* SAĞ: ÖDEME VE SİPARİŞ BİLGİLERİ */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-lg p-4 bg-white sticky-top" style={{top: '100px'}}>
                        <h5 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Sipariş Detayları</h5>

                        {/* 1. SİPARİŞ TİPİ (TAB) */}
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

                        {/* 2. DETAY FORMU */}
                        <div className="mb-4 animate-fade-in">
                            {orderType === 'delivery' ? (
                                <div>
                                    <label className="form-label small fw-bold text-uppercase text-muted">Teslimat Adresi</label>
                                    <textarea 
                                        className="form-control bg-light border-0" 
                                        rows="3" 
                                        placeholder="Cadde, sokak, bina no..." 
                                        value={address} 
                                        onChange={(e) => setAddress(e.target.value)}
                                    ></textarea>
                                </div>
                            ) : (
                                <div>
                                    <label className="form-label small fw-bold text-uppercase text-muted">Masa Seçimi</label>
                                    <select 
                                        className="form-select bg-light border-0 py-3" 
                                        value={selectedTableId} 
                                        onChange={(e) => setSelectedTableId(e.target.value)}
                                    >
                                        <option value="">Lütfen masanızı seçin...</option>
                                        {tables.filter(t => t.isAvailable).map(t => (
                                            <option key={t.id} value={t.id}>Masa {t.tableNumber} ({t.capacity} Kişilik)</option>
                                        ))}
                                    </select>
                                    <div className="form-text small mt-1 text-warning">
                                        <i className="fas fa-info-circle me-1"></i> Sadece boş masaları seçebilirsiniz.
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted">Sipariş Notu</label>
                            <input 
                                type="text" className="form-control bg-light border-0" 
                                placeholder="Örn: Zili çalmayın, sos bol olsun..."
                                value={note} onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <hr className="border-light my-4" />

                        {/* 3. ÖDEME YÖNTEMİ */}
                        <h6 className="mb-3 small fw-bold text-uppercase text-muted">Ödeme Yöntemi</h6>
                        
                        <div className="d-flex gap-2 mb-3">
                            <div 
                                className={`border rounded p-3 flex-fill cursor-pointer text-center ${paymentMethod === 'credit_card' ? 'border-warning bg-warning bg-opacity-10' : ''}`}
                                onClick={() => setPaymentMethod('credit_card')}
                                style={{cursor:'pointer'}}
                            >
                                <i className="fas fa-credit-card fa-lg mb-2 d-block"></i>
                                <small className="fw-bold">Kart ile Öde</small>
                            </div>
                            <div 
                                className={`border rounded p-3 flex-fill cursor-pointer text-center ${paymentMethod === 'cash' ? 'border-success bg-success bg-opacity-10' : ''}`}
                                onClick={() => setPaymentMethod('cash')}
                                style={{cursor:'pointer'}}
                            >
                                <i className="fas fa-money-bill-wave fa-lg mb-2 d-block"></i>
                                <small className="fw-bold">{orderType === 'delivery' ? 'Kapıda Nakit' : 'Kasada Öde'}</small>
                            </div>
                        </div>

                        {/* KREDİ KARTI FORMU */}
                        {paymentMethod === 'credit_card' && (
                            <div className="bg-light p-3 rounded mb-4 animate-fade-in border">
                                <div className="mb-3">
                                    <input type="text" className="form-control form-control-sm" placeholder="Kart Üzerindeki İsim" value={cardInfo.holder} onChange={e => setCardInfo({...cardInfo, holder: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control form-control-sm" placeholder="Kart Numarası (0000 0000 0000 0000)" maxLength="19" value={cardInfo.number} onChange={e => setCardInfo({...cardInfo, number: e.target.value})} />
                                </div>
                                <div className="row g-2">
                                    <div className="col-6">
                                        <input type="text" className="form-control form-control-sm" placeholder="AA/YY" maxLength="5" value={cardInfo.expiry} onChange={e => setCardInfo({...cardInfo, expiry: e.target.value})} />
                                    </div>
                                    <div className="col-6">
                                        <input type="text" className="form-control form-control-sm" placeholder="CVC" maxLength="3" value={cardInfo.cvc} onChange={e => setCardInfo({...cardInfo, cvc: e.target.value})} />
                                    </div>
                                </div>
                                <div className="mt-2 text-center">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="20" className="mx-1" alt="Visa"/>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="20" className="mx-1" alt="Mastercard"/>
                                    <small className="d-block text-muted mt-2" style={{fontSize: '0.7rem'}}><i className="fas fa-lock me-1"></i> 256-bit SSL ile güvenli ödeme</small>
                                </div>
                            </div>
                        )}

                        <button 
                            className="btn btn-dark w-100 py-3 text-uppercase fw-bold" 
                            style={{ letterSpacing: '1px' }}
                            onClick={handleCheckout}
                            disabled={items.length === 0}
                        >
                            {totalAmount} ₺ • Siparişi Onayla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;