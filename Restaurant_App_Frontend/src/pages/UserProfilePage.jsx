import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

function UserProfilePage() {
    const { user } = useSelector(state => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'info'

    // Profil Form State'i
    const [profileData, setProfileData] = useState({
        fullName: '',
        phoneNumber: '',
        city: '',
        address: ''
    });
    const [loadingProfile, setLoadingProfile] = useState(false);

    useEffect(() => {
        // 1. Siparişleri Çek
        orderService.getMyOrders()
            .then(data => {
                setOrders(data);
                setLoadingOrders(false);
            })
            .catch(err => setLoadingOrders(false));

        // 2. Profil Detaylarını Çek (User objesinde olmayan detaylar)
        authService.getProfile()
            .then(data => {
                setProfileData({
                    fullName: data.fullName || '',
                    phoneNumber: data.phoneNumber || '',
                    city: data.city || '',
                    address: data.address || ''
                });
            })
            .catch(err => console.error("Profil yüklenemedi"));
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            await authService.updateProfile(profileData);
            toast.success("Profil bilgileriniz güncellendi.");
        } catch (error) {
            toast.error("Güncelleme başarısız.");
        } finally {
            setLoadingProfile(false);
        }
    };

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="row">
                {/* SOL: KART */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-0 text-center p-4">
                        <div className="mb-3">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.email}&size=128&background=111&color=fff`}
                                className="rounded-circle border border-3 border-warning"
                                alt="Profile"
                            />
                        </div>
                        <h4 className="mb-1">{profileData.fullName || user?.fullName}</h4>
                        <p className="text-muted small mb-3">{user?.email}</p>

                        <div className="list-group list-group-flush text-start mt-3">
                            <button
                                className={`list-group-item list-group-item-action ${activeTab === 'orders' ? 'active bg-dark border-dark' : ''}`}
                                onClick={() => setActiveTab('orders')}
                            >
                                <i className="fas fa-receipt me-2"></i> Sipariş Geçmişi
                            </button>
                            <button
                                className={`list-group-item list-group-item-action ${activeTab === 'info' ? 'active bg-dark border-dark' : ''}`}
                                onClick={() => setActiveTab('info')}
                            >
                                <i className="fas fa-user-cog me-2"></i> Hesap Bilgileri
                            </button>
                        </div>
                    </div>
                </div>

                {/* SAĞ: İÇERİK */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 p-4" style={{ minHeight: '400px' }}>

                        {/* TAB 1: SİPARİŞLER */}
                        {activeTab === 'orders' && (
                            <div>
                                <h4 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Geçmiş Siparişlerim</h4>
                                {loadingOrders ? (
                                    <div className="text-center"><div className="spinner-border text-warning"></div></div>
                                ) : orders.length === 0 ? (
                                    <div className="alert alert-light text-center">
                                        Henüz bir siparişiniz bulunmuyor.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Sipariş No</th>
                                                    <th>Tarih</th>
                                                    <th>Tutar</th>
                                                    <th>Durum</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map(order => (
                                                    <tr key={order.id}>
                                                        <td>#{order.orderNum || order.id}</td>
                                                        <td>{new Date(order.orderDate).toLocaleDateString('tr-TR')}</td>
                                                        <td className="fw-bold">{order.totalAmount} ₺</td>
                                                        <td><span className="badge bg-success">Tamamlandı</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: HESAP BİLGİLERİ (FORM) */}
                        {activeTab === 'info' && (
                            <div>
                                <h4 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Hesap Bilgileri</h4>
                                <form onSubmit={handleProfileUpdate}>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="small text-muted">Ad Soyad</label>
                                            <input
                                                type="text" className="form-control"
                                                value={profileData.fullName}
                                                onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small text-muted">Email (Değiştirilemez)</label>
                                            <input type="text" className="form-control bg-light" value={user?.email} disabled />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="small text-muted">Telefon</label>
                                            <input
                                                type="text" className="form-control" placeholder="5XX..."
                                                value={profileData.phoneNumber}
                                                onChange={e => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small text-muted">Şehir</label>
                                            <input
                                                type="text" className="form-control" placeholder="İstanbul"
                                                value={profileData.city}
                                                onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="small text-muted">Kayıtlı Adres</label>
                                        <textarea
                                            className="form-control" rows="3"
                                            placeholder="Adresinizi buraya girin..."
                                            value={profileData.address}
                                            onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-dark px-4" disabled={loadingProfile}>
                                            {loadingProfile ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;