import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import { orderService } from '../services/orderService';
import { clearCart } from '../store/slices/cartSlice';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);

    // UI States
    const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'dinein'
    const [tables, setTables] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data
    const [address, setAddress] = useState(user?.address || '');
    const [selectedTable, setSelectedTable] = useState(null);
    const [note, setNote] = useState('');
    const [contactPhone, setContactPhone] = useState(user?.phoneNumber || '');

    // Payment Data 
    const [cardInfo, setCardInfo] = useState({ holder: '', number: '', expiry: '', cvc: '' });

    useEffect(() => {
        if (items.length === 0) navigate('/cart');
        // Masaları çek
        api.get('/Table').then(res => setTables(res.data));
    }, [items, navigate]);

    const handleCheckout = async () => {
        setIsSubmitting(true);
        try {
            if (orderType === 'delivery') {
                // --- EVE TESLİM SİPARİŞ ---
                if (!address || !contactPhone) {
                    toast.warning("Adres ve Telefon zorunludur."); setIsSubmitting(false); return;
                }

                // Iyzico veya Ödeme Kontrolü 
                if (cardInfo.number.length < 16) {
                    toast.warning("Geçersiz kart numarası."); setIsSubmitting(false); return;
                }

                const orderPayload = {
                    userId: user.id,
                    address: address,
                    city: user?.city || "İstanbul",
                    email: user.email,
                    phone: contactPhone,
                    orderNote: note,
                    paymentId: "IYZICO_TOKEN_123", // Backend'de Iyzico entegre edilecek
                    items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
                    totalAmount: totalAmount
                };


                await orderService.createOrder(orderPayload);

                navigate('/success', {
                    state: {
                        message: "Paket siparişiniz alındı.",
                        subMessage: "Siparişiniz hazırlanmaya başlandığında bildirim alacaksınız."
                    }
                });

            } else {
                // --- RESTORANDA (MASA) SİPARİŞ ---
                if (!selectedTable) {
                    toast.warning("Lütfen oturduğunuz masayı seçin."); setIsSubmitting(false); return;
                }

                const tablePayload = {
                    tableId: selectedTable.id,
                    totalAmount: totalAmount,
                    status: "Pending", // Admin onayı için bekleyen statüsü
                    userId: user.id, // Hangi kullanıcı sipariş verdi
                    orderItemsInRestaurant: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
                };

                await orderService.createTableOrder(tablePayload);
                // BAŞARILI -> ONAY SAYFASINA GİT
                navigate('/success', {
                    state: {
                        message: "Masa siparişiniz mutfağa iletildi.",
                        subMessage: "Garsonumuz siparişinizi onayladığında hazırlanmaya başlayacaktır. Lütfen bekleyiniz."
                    }
                });
            }

            dispatch(clearCart());


        } catch (error) {
            console.error("Sipariş Hatası:", error);
            // Hata detayını göster
            const errorMsg = error.response?.data?.errors
                ? Object.values(error.response.data.errors).join(', ')
                : "Sipariş oluşturulamadı.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="row">
                {/* SOL: SİPARİŞ DETAYLARI */}
                <div className="col-lg-8">
                    <h3 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Siparişi Tamamla</h3>

                    {/* 1. SEKMELER */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white p-0 border-bottom-0">
                            <ul className="nav nav-tabs nav-fill" id="orderTabs">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link py-3 fw-bold ${orderType === 'delivery' ? 'active text-dark border-bottom-0' : 'text-muted bg-light'}`}
                                        onClick={() => setOrderType('delivery')}
                                    >
                                        <i className="fas fa-motorcycle me-2"></i> Eve Teslim
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link py-3 fw-bold ${orderType === 'dinein' ? 'active text-dark border-bottom-0' : 'text-muted bg-light'}`}
                                        onClick={() => setOrderType('dinein')}
                                    >
                                        <i className="fas fa-utensils me-2"></i> Restoranda
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="card-body p-4">
                            {orderType === 'delivery' ? (
                                <div className="fade-in">
                                    <h5 className="mb-3">Teslimat Bilgileri</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small">İletişim Numarası</label>
                                            <input type="text" className="form-control" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="05XX..." />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label text-muted small">Teslimat Adresi</label>
                                            <textarea className="form-control" rows="3" value={address} onChange={e => setAddress(e.target.value)} placeholder="Mahalle, Cadde, Sokak, Apt No..."></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label text-muted small">Sipariş Notu</label>
                                            <input type="text" className="form-control" value={note} onChange={e => setNote(e.target.value)} placeholder="Zili çalmayın, temassız teslimat vb." />
                                        </div>
                                    </div>

                                    <hr className="my-4" />

                                    {/* KREDİ KARTI FORMU */}
                                    <h5 className="mb-3">Ödeme Bilgileri (Iyzico Güvencesiyle)</h5>
                                    <div className="bg-light p-4 rounded border">
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Kart Üzerindeki İsim</label>
                                            <input type="text" className="form-control" value={cardInfo.holder} onChange={e => setCardInfo({ ...cardInfo, holder: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Kart Numarası</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white"><i className="far fa-credit-card"></i></span>
                                                <input type="text" className="form-control" maxLength="16" placeholder="0000 0000 0000 0000" value={cardInfo.number} onChange={e => setCardInfo({ ...cardInfo, number: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <label className="form-label small fw-bold">Son Kullanma (AA/YY)</label>
                                                <input type="text" className="form-control" maxLength="5" placeholder="MM/YY" value={cardInfo.expiry} onChange={e => setCardInfo({ ...cardInfo, expiry: e.target.value })} />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small fw-bold">CVV / CVC</label>
                                                <input type="text" className="form-control" maxLength="3" placeholder="123" value={cardInfo.cvc} onChange={e => setCardInfo({ ...cardInfo, cvc: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="fade-in">
                                    <h5 className="mb-3">Masa Seçimi</h5>
                                    <p className="text-muted small mb-4">Lütfen şu an oturduğunuz masayı seçiniz. Siparişiniz onaylandıktan sonra masanıza getirilecektir.</p>

                                    {/* GÖRSEL MASA SEÇİMİ */}
                                    <div className="row g-3">
                                        {tables.map(table => (
                                            <div key={table.id} className="col-6 col-md-4 col-lg-3">
                                                <div
                                                    className={`card text-center p-3 border ${selectedTable?.id === table.id ? 'border-warning bg-warning bg-opacity-10' : ''} ${!table.isAvailable ? 'opacity-50' : ''}`}
                                                    style={{ cursor: table.isAvailable ? 'pointer' : 'not-allowed' }}
                                                    onClick={() => table.isAvailable && setSelectedTable(table)}
                                                >
                                                    <i className={`fas fa-chair fa-2x mb-2 ${selectedTable?.id === table.id ? 'text-warning' : 'text-secondary'}`}></i>
                                                    <h6 className="mb-0 fw-bold">{table.tableNumber}</h6>
                                                    <small className="text-muted">{table.capacity} Kişilik</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4">
                                        <label className="form-label small text-muted">Masa Notu</label>
                                        <input type="text" className="form-control" value={note} onChange={e => setNote(e.target.value)} placeholder="Örn: Ketçap mayonez lütfen..." />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SAĞ: ÖZET */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-lg p-4 sticky-top" style={{ top: '100px' }}>
                        <h5 className="mb-3" style={{ fontFamily: 'Playfair Display' }}>Sipariş Özeti</h5>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Ürünler Toplamı</span>
                            <span>{totalAmount} ₺</span>
                        </div>
                        {orderType === 'delivery' && (
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Teslimat Ücreti</span>
                                <span className="text-success fw-bold">Ücretsiz</span>
                            </div>
                        )}

                        <hr />

                        <div className="d-flex justify-content-between mb-4 align-items-center">
                            <span className="fw-bold fs-5">Toplam Tutar</span>
                            <span className="fw-bold fs-3 text-success">{totalAmount} ₺</span>
                        </div>

                        <button
                            className="btn btn-dark w-100 py-3 text-uppercase fw-bold"
                            onClick={handleCheckout}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                        </button>

                        <div className="text-center mt-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="20" className="mx-2 opacity-50" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="20" className="mx-2 opacity-50" alt="Mastercard" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}