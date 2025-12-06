import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { clearCart } from '../store/slices/cartSlice';
import OrderSuccessModal from '../components/StatusPages/OrderSuccessModal';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { items, totalAmount } = useSelector(state => state.cart);
    const { user, isAuthenticated } = useSelector(state => state.auth);

    const [orderType, setOrderType] = useState('delivery');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [tables, setTables] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [address, setAddress] = useState(user?.address || '');
    const [contactPhone, setContactPhone] = useState(user?.phoneNumber || '');
    const [note, setNote] = useState('');
    const [selectedTableId, setSelectedTableId] = useState(''); 
    const [cardInfo, setCardInfo] = useState({ holder: '', number: '', expiry: '', cvc: '' });

    useEffect(() => {
        if (!isAuthenticated) {
            toast.warning("Lütfen giriş yapın.");
            navigate('/login');
            return;
        }
        if (items.length === 0) {
            navigate('/cart');
            return;
        }
        api.get('/Table').then(res => setTables(res.data)).catch(console.error);
    }, [items, isAuthenticated, navigate]);

    const fillTestCard = () => {
        setCardInfo({ holder: 'TEST USER', number: '4609713665715202', expiry: '12/30', cvc: '123' });
        toast.info("Test kartı bilgileri dolduruldu.");
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
        setCardInfo({ ...cardInfo, expiry: val });
    };

    const handleCheckout = async () => {
        setIsSubmitting(true);
        console.log("Sipariş işlemi başladı..."); // DEBUG

        try {
            if (orderType === 'delivery') {
                if (!address || !contactPhone) {
                    toast.warning("Adres ve Telefon zorunludur."); setIsSubmitting(false); return;
                }

                let transactionId = "CASH_ON_DELIVERY";

                if (paymentMethod === 'credit_card') {
                    if (cardInfo.number.length < 16) {
                        toast.warning("Geçersiz kart numarası."); setIsSubmitting(false); return;
                    }
                    if (!cardInfo.expiry.includes('/')) {
                        toast.warning("Son kullanma tarihi hatalı (AA/YY)."); setIsSubmitting(false); return;
                    }
                    
                    const [expMonth, expYear] = cardInfo.expiry.split('/');
                    const paymentData = {
                        cardHolderName: cardInfo.holder,
                        cardNumber: cardInfo.number,
                        expireMonth: expMonth,
                        expireYear: "20" + expYear,
                        cvc: cardInfo.cvc,
                        price: totalAmount,
                        basketId: "B" + Date.now(),
                        buyerId: user.id,
                        buyerName: user.fullName || "Misafir",
                        buyerSurname: "Müşteri",
                        buyerEmail: user.email,
                        buyerAddress: address,
                        buyerCity: user.city || "Istanbul",
                        buyerCountry: "Turkey"
                    };

                    console.log("Ödeme İsteği Gönderiliyor...", paymentData); // DEBUG

                    try {
                        const paymentResult = await paymentService.processPayment(paymentData);
                        if (paymentResult.status === "Success") {
                            transactionId = paymentResult.transactionId;
                            toast.info("Ödeme Başarılı! Sipariş oluşturuluyor...");
                        } else {
                            toast.error("Ödeme Hatası: " + (paymentResult.errorMessage || "İşlem reddedildi."));
                            setIsSubmitting(false);
                            return;
                        }
                    } catch (payError) {
                        console.error("Ödeme Bağlantı Hatası:", payError);
                        const errorMsg = payError.response?.data?.ErrorMessage || 
                                         payError.response?.data?.errorMessage || 
                                         "Ödeme servisine ulaşılamadı.";
                        toast.error(errorMsg);
                        setIsSubmitting(false);
                        return;
                    }
                }

                const orderPayload = {
                    userId: user.id,
                    address: address,
                    city: user?.city || "İstanbul",
                    email: user.email,
                    phone: contactPhone,
                    orderNote: note,
                    paymentId: transactionId,
                    items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
                    totalAmount: totalAmount
                };

                console.log("Sipariş Oluşturuluyor...", orderPayload); // DEBUG
                await orderService.createOrder(orderPayload);
                setSuccessMessage("Paket siparişiniz alındı. Hazırlanıyor...");

            } else {
                if (!selectedTableId) {
                    toast.warning("Lütfen masa seçin."); setIsSubmitting(false); return;
                }

                const tablePayload = {
                    tableId: parseInt(selectedTableId),
                    totalAmount: totalAmount,
                    status: "Pending",
                    userId: user.id,
                    orderItems: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
                };

                console.log("Masa Siparişi Oluşturuluyor...", tablePayload);
                await orderService.createTableOrder(tablePayload);
                setSuccessMessage("Siparişiniz mutfağa iletildi. Onay bekleniyor.");
            }

            console.log("Sipariş BAŞARILI! Sepet temizleniyor ve modal açılıyor."); 
            dispatch(clearCart());
            setShowSuccessModal(true);

        } catch (error) {
            console.error("Sipariş Hatası (Catch Bloğu):", error); 
            const errorMsg = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join(', ')
                : (error.message || "Sipariş oluşturulamadı.");
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getButtonText = () => {
        if (isSubmitting) return 'İşleniyor...';
        if (orderType === 'dinein') return 'Siparişi Mutfağa Gönder';
        return paymentMethod === 'credit_card' ? `Kart ile Öde (${totalAmount} ₺)` : 'Siparişi Onayla (Nakit)';
    };

    return (
        <div className="container mt-5 pt-5 mb-5">
            <OrderSuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} customMessage={successMessage} />
            {/* ... Kalan HTML aynı ... */}
            <div className="row">
                <div className="col-lg-8">
                    <h3 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Siparişi Tamamla</h3>
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white p-0 border-bottom-0">
                            <ul className="nav nav-tabs nav-fill">
                                <li className="nav-item">
                                    <button className={`nav-link py-3 fw-bold ${orderType === 'delivery' ? 'active text-dark border-bottom-0' : 'text-muted bg-light'}`} onClick={() => setOrderType('delivery')}>
                                        <i className="fas fa-motorcycle me-2"></i> Eve Teslim
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link py-3 fw-bold ${orderType === 'dinein' ? 'active text-dark border-bottom-0' : 'text-muted bg-light'}`} onClick={() => setOrderType('dinein')}>
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
                                        <div className="col-md-6"><label className="form-label small">Telefon</label><input type="text" className="form-control" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} placeholder="05XX..." /></div>
                                        <div className="col-12"><label className="form-label small">Adres</label><textarea className="form-control" rows="2" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Mahalle, Cadde, Sokak..."></textarea></div>
                                        <div className="col-12"><label className="form-label small">Not</label><input type="text" className="form-control" value={note} onChange={e=>setNote(e.target.value)} placeholder="Zili çalmayın..." /></div>
                                    </div>
                                    <hr className="my-4"/>
                                    <h5 className="mb-3">Ödeme</h5>
                                    <div className="d-flex gap-3 mb-4">
                                        <div className={`border rounded p-3 flex-fill text-center cursor-pointer ${paymentMethod==='credit_card'?'border-warning bg-warning bg-opacity-10':''}`} onClick={()=>setPaymentMethod('credit_card')}>Kredi Kartı</div>
                                        <div className={`border rounded p-3 flex-fill text-center cursor-pointer ${paymentMethod==='cash'?'border-success bg-success bg-opacity-10':''}`} onClick={()=>setPaymentMethod('cash')}>Nakit</div>
                                    </div>
                                    {paymentMethod === 'credit_card' && (
                                        <div className="bg-light p-4 rounded border position-relative">
                                            <button className="btn btn-sm btn-link position-absolute top-0 end-0 text-decoration-none" onClick={fillTestCard}>Test Kartı</button>
                                            <div className="mb-3"><label className="form-label small fw-bold">Kart Sahibi</label><input type="text" className="form-control" value={cardInfo.holder} onChange={e=>setCardInfo({...cardInfo, holder:e.target.value})}/></div>
                                            <div className="mb-3"><label className="form-label small fw-bold">Kart Numarası</label><input type="text" className="form-control" maxLength="16" value={cardInfo.number} onChange={e=>setCardInfo({...cardInfo, number:e.target.value})}/></div>
                                            <div className="row g-3">
                                                <div className="col-6"><label className="form-label small fw-bold">SKT</label><input type="text" className="form-control" maxLength="5" placeholder="AA/YY" value={cardInfo.expiry} onChange={handleExpiryChange}/></div>
                                                <div className="col-6"><label className="form-label small fw-bold">CVC</label><input type="text" className="form-control" maxLength="3" value={cardInfo.cvc} onChange={e=>setCardInfo({...cardInfo, cvc:e.target.value})}/></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="fade-in">
                                    <h5 className="mb-3">Masa Seçimi</h5>
                                    <div className="row g-3 mb-4">
                                        {tables.length > 0 ? tables.map(table => (
                                            <div key={table.id} className="col-6 col-md-4 col-lg-3">
                                                <div className={`card text-center p-3 border ${parseInt(selectedTableId)===table.id ? 'border-warning bg-warning bg-opacity-10':''} ${!table.isAvailable ? 'opacity-50 bg-light':''}`} style={{cursor: table.isAvailable?'pointer':'not-allowed'}} onClick={()=>table.isAvailable && setSelectedTableId(table.id)}>
                                                    <i className="fas fa-chair fa-2x mb-2 text-secondary"></i>
                                                    <h6 className="mb-0">{table.tableNumber}</h6>
                                                    <small className="text-muted">{table.capacity} Kişilik</small>
                                                </div>
                                            </div>
                                        )) : <div className="alert alert-warning">Müsait masa yok.</div>}
                                    </div>
                                    <div className="mt-4"><label className="form-label small">Not</label><input type="text" className="form-control" value={note} onChange={e=>setNote(e.target.value)}/></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card border-0 shadow-lg p-4 sticky-top" style={{top:'100px'}}>
                        <h5 className="mb-3">Özet</h5>
                        <div className="d-flex justify-content-between mb-2"><span>Ürünler</span><span>{totalAmount} ₺</span></div>
                        <hr/>
                        <div className="d-flex justify-content-between mb-4"><span className="fw-bold">Toplam</span><span className="fw-bold fs-4 text-success">{totalAmount} ₺</span></div>
                        <button className="btn btn-dark w-100 py-3 fw-bold" onClick={handleCheckout} disabled={isSubmitting}>{getButtonText()}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}