import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import { orderService } from '../services/orderService';
import { clearCart } from '../store/slices/cartSlice';
import OrderSuccessModal from '../components/StatusPages/OrderSuccessModal';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount } = useSelector(state => state.cart);
    const { user, isAuthenticated } = useSelector(state => state.auth);

    // UI States
    const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'dinein'
    const [tables, setTables] = useState([]); // Başlangıçta boş dizi
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Form Data
    const [address, setAddress] = useState(user?.address || '');
    const [selectedTableId, setSelectedTableId] = useState('');
    const [note, setNote] = useState('');
    const [contactPhone, setContactPhone] = useState(user?.phoneNumber || '');
    const [cardInfo, setCardInfo] = useState({ holder: '', number: '', expiry: '', cvc: '' });

    useEffect(() => {
        // 1. Güvenlik Kontrolü
        if (!isAuthenticated) {
             toast.warning("Oturum açmalısınız.");
             navigate('/login');
             return;
        }
        
        // 2. Sepet Kontrolü
        if (items.length === 0) {
            navigate('/cart');
            return;
        }
        
        // 3. Masaları Çek (DEBUG EKLENDİ)
        const fetchTables = async () => {
            try {
                const res = await api.get('/Table');
                console.log("MASALAR GELDİ:", res.data); 
                
                if (Array.isArray(res.data)) {
                    // Sadece Müsait ve Kapasitesi olanları alabiliriz
                    setTables(res.data);
                } else {
                    console.error("Masalar dizi formatında gelmedi!", res.data);
                    toast.error("Masa bilgisi yüklenemedi.");
                }
            } catch (error) {
                console.error("Masa çekme hatası:", error);
            }
        };

        fetchTables();

    }, [items, navigate, isAuthenticated]);

    const handleCheckout = async () => {
        setIsSubmitting(true);
        try {
            if (orderType === 'delivery') {
                // --- EVE TESLİM ---
                if (!address || !contactPhone) {
                    toast.warning("Adres ve Telefon zorunludur."); setIsSubmitting(false); return;
                }
                // Basit Kart Kontrolü
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
                    paymentId: "CC_IYZICO_PAID", 
                    items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
                    totalAmount: totalAmount
                };

                await orderService.createOrder(orderPayload);
                setSuccessMessage("Paket siparişiniz alındı. Hazırlanıyor...");

            } else {
                // --- MASA SİPARİŞİ ---
                if (!selectedTableId) {
                    toast.warning("Lütfen oturduğunuz masayı seçin."); setIsSubmitting(false); return;
                }

                const tablePayload = {
                    tableId: parseInt(selectedTableId),
                    totalAmount: totalAmount,
                    status: "Pending",
                    userId: user.id,
                    orderItems: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
                };

                await orderService.createTableOrder(tablePayload);
                setSuccessMessage("Siparişiniz mutfağa iletildi. Onay bekleniyor.");
            }

            dispatch(clearCart());
            setShowSuccessModal(true);

        } catch (error) {
            console.error("Sipariş Hatası:", error);
            const errorMsg = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join(', ')
                : (error.response?.data?.message || "Sipariş oluşturulurken bir hata oluştu.");
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // MASA DURUMUNA GÖRE STİL (Helper)
    const getTableCardStyle = (table) => {
        const isSelected = parseInt(selectedTableId) === table.id;
        const isAvailable = table.isAvailable !== false; 
        
        if (!isAvailable) return { border: 'border-secondary', bg: 'bg-secondary bg-opacity-10', cursor: 'not-allowed', icon: 'text-secondary' };
        if (isSelected) return { border: 'border-warning', bg: 'bg-warning bg-opacity-10', cursor: 'pointer', icon: 'text-warning' };
        return { border: 'border-secondary', bg: 'bg-white', cursor: 'pointer', icon: 'text-dark' };
    };

    return (
        <div className="container mt-5 pt-5 mb-5">
            <OrderSuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} customMessage={successMessage} />

            <div className="row">
                <div className="col-lg-8">
                    <h3 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Siparişi Tamamla</h3>
                    
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white p-0 border-bottom-0">
                            <ul className="nav nav-tabs nav-fill">
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
                                            <textarea className="form-control" rows="3" value={address} onChange={e => setAddress(e.target.value)} placeholder="Açık adres..."></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label text-muted small">Sipariş Notu</label>
                                            <input type="text" className="form-control" value={note} onChange={e => setNote(e.target.value)} placeholder="Zili çalmayın vb." />
                                        </div>
                                    </div>

                                    <hr className="my-4" />
                                    
                                    <h5 className="mb-3">Ödeme Bilgileri</h5>
                                    <div className="bg-light p-4 rounded border">
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Kart Sahibi</label>
                                            <input type="text" className="form-control" value={cardInfo.holder} onChange={e => setCardInfo({ ...cardInfo, holder: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Kart Numarası</label>
                                            <input type="text" className="form-control" maxLength="16" value={cardInfo.number} onChange={e => setCardInfo({ ...cardInfo, number: e.target.value })} placeholder="0000 0000 0000 0000" />
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <label className="form-label small fw-bold">SKT</label>
                                                <input type="text" className="form-control" maxLength="5" placeholder="MM/YY" value={cardInfo.expiry} onChange={e => setCardInfo({ ...cardInfo, expiry: e.target.value })} />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small fw-bold">CVC</label>
                                                <input type="text" className="form-control" maxLength="3" placeholder="123" value={cardInfo.cvc} onChange={e => setCardInfo({ ...cardInfo, cvc: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="fade-in">
                                    <h5 className="mb-3">Masa Seçimi</h5>
                                    <p className="text-muted small mb-4">Lütfen şu an oturduğunuz masayı seçiniz.</p>

                                    {/* MASA IZGARASI */}
                                    {tables.length > 0 ? (
                                        <div className="row g-3">
                                            {tables.map(table => {
                                                const style = getTableCardStyle(table);
                                                const tNumber = table.tableNumber || table.TableNumber || `Masa ${table.id}`;
                                                const tCapacity = table.capacity || table.Capacity;
                                                const isAvailable = table.isAvailable !== false; 

                                                return (
                                                    <div key={table.id} className="col-6 col-md-4 col-lg-3">
                                                        <div
                                                            className={`card text-center p-3 border ${style.border} ${style.bg}`}
                                                            style={{ cursor: style.cursor }}
                                                            onClick={() => isAvailable && setSelectedTableId(table.id)}
                                                        >
                                                            <i className={`fas fa-chair fa-2x mb-2 ${style.icon}`}></i>
                                                            <h6 className="mb-0 fw-bold">{tNumber}</h6>
                                                            <small className="text-muted">{tCapacity} Kişilik</small>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning">
                                            Masa bilgileri yüklenemedi veya uygun masa yok.
                                        </div>
                                    )}

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
                        <hr />
                        <div className="d-flex justify-content-between mb-4 align-items-center">
                            <span className="fw-bold fs-5">Toplam Tutar</span>
                            <span className="fw-bold fs-3 text-success">{totalAmount} ₺</span>
                        </div>
                        
                        <button
                            className={`btn w-100 py-3 text-uppercase fw-bold ${orderType === 'delivery' ? 'btn-success' : 'btn-dark'}`}
                            onClick={handleCheckout}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'İşleniyor...' : (orderType === 'delivery' ? 'Ödemeyi Tamamla' : 'Siparişi Mutfağa Gönder')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}