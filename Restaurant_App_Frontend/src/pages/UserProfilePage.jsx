import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { reservationService } from '../services/reservationService';
import { toast } from 'react-toastify';
import UserOrderDetailModal from '../components/UserOrderDetailModal';
import '../styles/home.scss';

function UserProfilePage() {
    const { user } = useSelector(state => state.auth);

    // State'ler
    const [orders, setOrders] = useState([]);
    const [myReservations, setMyReservations] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reservations' | 'settings'
    const [loading, setLoading] = useState(true);

    // Profil Form State'i
    const [profileData, setProfileData] = useState({
        fullName: '', phoneNumber: '', city: '', address: ''
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [ordersData, profileRes, resData] = await Promise.all([
                    orderService.getMyOrders(),
                    authService.getProfile(),
                    reservationService.getMyReservations()
                ]);

                setOrders(ordersData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
                setMyReservations(resData.sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate)));

                setProfileData({
                    fullName: profileRes.fullName || '',
                    phoneNumber: profileRes.phoneNumber || '',
                    city: profileRes.city || '',
                    address: profileRes.address || ''
                });
                setLoading(false);
            } catch (error) {
                console.error("Veri yükleme hatası", error);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await authService.updateProfile(profileData);
            toast.success("Profil bilgileriniz başarıyla güncellendi.");
        } catch (error) {
            toast.error("Güncelleme sırasında bir hata oluştu.");
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelReservation = async (reservation) => {
        if (!window.confirm("Rezervasyonunuzu iptal etmek istediğinize emin misiniz?")) return;

        try {
            // Status 3 = Cancelled (User tarafından)
            // Backend DTO beklediği için tüm objeyi güncellemeliyiz
            const updatedRes = { ...reservation, status: 3, reservationDate: reservation.reservationDate };

            await reservationService.update(reservation.id, updatedRes);
            toast.success("Rezervasyonunuz iptal edildi.");

            window.location.reload();
        } catch (error) {
            toast.error("İptal işlemi başarısız.");
        }
    };

    // Durum Rozeti Yardımcısı
    const getStatusBadge = (status) => {
        // Rezervasyon için status int gelebilir, sipariş için enum
        if (status === 1 || status === 'Completed') return <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">Tamamlandı</span>;
        if (status === 0 || status === 'Pending') return <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2">Bekliyor</span>;
        if (status === 2 || status === 'Canceled' || status === 'Rejected') return <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">İptal/Red</span>;
        return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">{status}</span>;
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="row g-4">

                {/* SOL: PROFİL KARTI */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <div className="card-body text-center p-5">
                            <div className="position-relative d-inline-block mb-4">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.email}&size=128&background=c5a059&color=fff`}
                                    className="rounded-circle p-1 border border-2 border-warning"
                                    style={{ width: '100px', height: '100px' }}
                                    alt="Profile"
                                />
                            </div>
                            <h4 className="mb-1" style={{ fontFamily: 'Playfair Display' }}>{profileData.fullName || user?.fullName}</h4>
                            <p className="text-muted small mb-4">{user?.email}</p>

                            <div className="d-grid gap-2">
                                <button
                                    className={`btn text-start py-3 px-4 ${activeTab === 'orders' ? 'btn-dark' : 'btn-light text-muted'}`}
                                    onClick={() => setActiveTab('orders')}
                                >
                                    <i className="fas fa-receipt me-3"></i> Sipariş Geçmişi
                                </button>
                                <button
                                    className={`btn text-start py-3 px-4 ${activeTab === 'reservations' ? 'btn-dark' : 'btn-light text-muted'}`}
                                    onClick={() => setActiveTab('reservations')}
                                >
                                    <i className="fas fa-calendar-alt me-3"></i> Rezervasyonlarım
                                </button>
                                <button
                                    className={`btn text-start py-3 px-4 ${activeTab === 'settings' ? 'btn-dark' : 'btn-light text-muted'}`}
                                    onClick={() => setActiveTab('settings')}
                                >
                                    <i className="fas fa-user-cog me-3"></i> Hesap Ayarları
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAĞ: İÇERİK ALANI */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <div className="card-body p-4 p-lg-5">

                            {/* TAB 1: SİPARİŞLER */}
                            {activeTab === 'orders' && (
                                <div className="animate-fade-in">
                                    <h4 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Geçmiş Siparişler</h4>
                                    {orders.length === 0 ? (
                                        <div className="text-center py-5 text-muted">
                                            <i className="fas fa-shopping-bag fa-3x mb-3 opacity-25"></i>
                                            <p>Henüz bir siparişiniz bulunmuyor.</p>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table align-middle" style={{ color: 'var(--text-main)' }}>
                                                <thead>
                                                    <tr className="text-muted small text-uppercase">
                                                        <th>Sipariş No</th>
                                                        <th>Tarih</th>
                                                        <th>Tutar</th>
                                                        <th>Durum</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map(order => (
                                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                            <td className="fw-bold">#{order.orderNum || order.id}</td>
                                                            <td>{new Date(order.orderDate).toLocaleDateString('tr-TR')}</td>
                                                            <td className="text-success fw-bold">{order.totalAmount} ₺</td>
                                                            <td>{getStatusBadge(order.orderState)}</td>
                                                            <td className="text-end">
                                                                <button onClick={() => setSelectedOrderId(order.id)} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                                                                    Detay
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: REZERVASYONLAR */}
                            {activeTab === 'reservations' && (
                                <div className="animate-fade-in">
                                    <h4 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Rezervasyonlarım</h4>
                                    {myReservations.length === 0 ? (
                                        <div className="text-center py-5 text-muted">
                                            <i className="fas fa-calendar-times fa-3x mb-3 opacity-25"></i>
                                            <p>Aktif rezervasyonunuz bulunmuyor.</p>
                                            <a href="/reservations" className="btn btn-sm btn-outline-dark mt-2">Hemen Rezervasyon Yap</a>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {myReservations.map(res => {
                                                const isPast = new Date(res.reservationDate) < new Date();
                                                const isCancellable = res.status !== 3 && res.status !== 2 && !isPast; // İptal/Red değilse ve geçmemişse

                                                return (
                                                    <div key={res.id} className="p-3 border rounded d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-body)' }}>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="bg-light rounded p-3 text-center border" style={{ minWidth: '80px' }}>
                                                                <div className="fw-bold text-dark" style={{ fontSize: '1.2rem' }}>{new Date(res.reservationDate).getDate()}</div>
                                                                <div className="small text-uppercase text-muted">{new Date(res.reservationDate).toLocaleString('tr-TR', { month: 'short' })}</div>
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-1 fw-bold">Akşam Yemeği ({res.numberOfGuests} Kişi)</h6>
                                                                <p className="mb-0 small text-muted">
                                                                    <i className="far fa-clock me-1"></i> {new Date(res.reservationDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                                    <span className="mx-2">|</span>
                                                                    {/* Backend'den masa no gelmiyorsa sadece ID yazar */}
                                                                    <i className="fas fa-chair me-1"></i> Masa {res.tableId ? res.tableId : 'Otomatik'}
                                                                </p>
                                                                {res.specialRequests && <small className="text-warning d-block mt-1"><i className="fas fa-info-circle me-1"></i> {res.specialRequests}</small>}
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-column align-items-end gap-2">
                                                            {/* Durum Rozeti */}
                                                            {res.status === 0 && <span className="badge bg-warning text-dark px-3">Onay Bekliyor</span>}
                                                            {res.status === 1 && <span className="badge bg-success px-3">Onaylandı</span>}
                                                            {res.status === 2 && <span className="badge bg-danger px-3">Reddedildi</span>}
                                                            {res.status === 3 && <span className="badge bg-secondary px-3">İptal Edildi</span>}

                                                            {/* İPTAL BUTONU (Kullanıcı Vazgeçebilir) */}
                                                            {isCancellable && (
                                                                <button
                                                                    onClick={() => handleCancelReservation(res)}
                                                                    className="btn btn-sm btn-outline-danger border-0 text-decoration-underline"
                                                                    style={{ fontSize: '0.8rem' }}
                                                                >
                                                                    İptal Et
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* TAB 3: AYARLAR */}
                            {activeTab === 'settings' && (
                                <div className="animate-fade-in">
                                    <h4 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Hesap Bilgileri</h4>
                                    <form onSubmit={handleProfileUpdate}>
                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Ad Soyad</label>
                                                <input type="text" className="form-control" value={profileData.fullName} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">E-posta</label>
                                                <input type="text" className="form-control" value={user?.email} disabled style={{ opacity: 0.7 }} />
                                            </div>
                                        </div>
                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Telefon</label>
                                                <input type="text" className="form-control" value={profileData.phoneNumber} onChange={e => setProfileData({ ...profileData, phoneNumber: e.target.value })} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Şehir</label>
                                                <input type="text" className="form-control" value={profileData.city} onChange={e => setProfileData({ ...profileData, city: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label small fw-bold">Adres</label>
                                            <textarea className="form-control" rows="3" value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })}></textarea>
                                        </div>
                                        <div className="text-end">
                                            <button type="submit" className="btn btn-dark px-4" disabled={updating}>
                                                {updating ? 'Güncelleniyor...' : 'Kaydet'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {selectedOrderId && <UserOrderDetailModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />}
        </div>
    );
}

export default UserProfilePage;