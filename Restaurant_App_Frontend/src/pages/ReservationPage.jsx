import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import '../styles/home.scss';

function ReservationPage() {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [tables, setTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState('');
    
    // Form State
    const [formData, setFormData] = useState({
        reservationDate: '',
        numberOfGuests: 2,
        specialRequests: ''
    });

    useEffect(() => {
        api.get('/Table').then(res => setTables(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            toast.info("Rezervasyon yapmak için lütfen giriş yapınız.");
            navigate('/login');
            return;
        }

        const payload = {
            ...formData,
            tableId: selectedTableId ? parseInt(selectedTableId) : 0, // Seçilmezse 0 gönderelim, backend otomatik atar
            customerName: user.fullName || user.email,
            customerPhone: user.phoneNumber || "Belirtilmedi",
        };

        try {
            await api.post('/Reservation', payload);
            toast.success("Rezervasyon talebiniz alındı! Durumu profilinizden takip edebilirsiniz.");
            setFormData({ reservationDate: '', numberOfGuests: 2, specialRequests: '' });
            setSelectedTableId('');
        } catch (error) {
            toast.error("İşlem başarısız. Lütfen tarih ve saat kontrolü yapınız.");
        }
    };

    return (
        <div className="d-flex flex-wrap" style={{ minHeight: '100vh', paddingTop: '80px' }}>
            
            {/* SOL TARAF: GÖRSEL */}
            <div className="col-lg-6 d-none d-lg-block position-relative">
                <div 
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100%',
                        width: '100%',
                        position: 'absolute'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)' }}></div>
                    <div className="d-flex align-items-center justify-content-center h-100 text-white position-relative p-5 text-center">
                        <div>
                            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3.5rem', marginBottom: '1rem' }}>Özel Bir Akşam</h1>
                            <p style={{ fontSize: '1.2rem', fontWeight: '300', maxWidth: '400px', margin: '0 auto' }}>
                                LUNA'da yerinizi ayırtın ve unutulmaz lezzetlerin tadını çıkarın.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAĞ TARAF: FORM (Dinamik Arkaplan Rengi) */}
            <div 
                className="col-lg-6 d-flex align-items-center justify-content-center p-5"
                style={{ 
                    backgroundColor: 'var(--bg-card)', // Light: Beyaz, Dark: Koyu Gri
                    color: 'var(--text-main)'          // Light: Siyah, Dark: Beyaz
                }}
            >
                <div style={{ maxWidth: '500px', width: '100%' }}>
                    
                    <div className="text-center mb-5">
                        <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem' }}>Rezervasyon</h2>
                        <div style={{ width: '60px', height: '3px', background: '#c5a059', margin: '15px auto' }}></div>
                        <p className="text-muted">Lütfen detayları eksiksiz doldurunuz.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold small text-uppercase">Tarih & Saat</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-control py-3"
                                    value={formData.reservationDate}
                                    onChange={e => setFormData({ ...formData, reservationDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold small text-uppercase">Kişi Sayısı</label>
                                <select 
                                    className="form-select py-3"
                                    value={formData.numberOfGuests}
                                    onChange={e => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                                >
                                    {[2,3,4,5,6,8,10,12,15].map(n => <option key={n} value={n}>{n} Kişi</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold small text-uppercase">Masa Tercihi</label>
                            <select 
                                className="form-select py-3"
                                value={selectedTableId}
                                onChange={e => setSelectedTableId(e.target.value)}
                            >
                                <option value="">Otomatik Seçim (Müsaitlik Durumuna Göre)</option>
                                {tables.filter(t => t.isAvailable).map(t => (
                                    <option key={t.id} value={t.id}>Masa {t.tableNumber} (Kapasite: {t.capacity})</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-5">
                            <label className="form-label fw-bold small text-uppercase">Özel İstekler</label>
                            <textarea 
                                className="form-control" 
                                rows="3"
                                placeholder="Doğum günü, alerji vb. notlarınız..."
                                value={formData.specialRequests}
                                onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                            ></textarea>
                        </div>

                        {isAuthenticated ? (
                            <button type="submit" className="btn btn-dark w-100 py-3 text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>
                                Rezervasyonu Onayla
                            </button>
                        ) : (
                            <div className="text-center">
                                <div className="alert alert-warning border-0 mb-3" style={{background: 'rgba(197, 160, 89, 0.1)', color: 'var(--text-main)'}}>
                                    Rezervasyon yapmak için hesabınıza giriş yapmanız gerekmektedir.
                                </div>
                                <button type="button" onClick={() => navigate('/login')} className="btn btn-outline-dark w-100 py-3 text-uppercase fw-bold">
                                    Giriş Yap / Kayıt Ol
                                </button>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReservationPage;