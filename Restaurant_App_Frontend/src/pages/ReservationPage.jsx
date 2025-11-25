import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { tableService } from '../services/tableService'; // Servisi import ettik
import api from '../api/axiosInstance';
import '../styles/home.scss';

function ReservationPage() {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [tables, setTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState('');
    const [loadingTables, setLoadingTables] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        reservationDate: '',
        numberOfGuests: 2,
        specialRequests: ''
    });

    // TARİH veya KİŞİ SAYISI değiştiğinde masaları yeniden çek
    useEffect(() => {
        if (formData.reservationDate) {
            checkAvailability();
        }
    }, [formData.reservationDate, formData.numberOfGuests]);

    const checkAvailability = async () => {
        setLoadingTables(true);
        try {
            // Backend'e sor: Bu tarihte ve bu kişi sayısında hangileri boş?
            const availableTables = await tableService.getAvailable(
                formData.reservationDate, 
                formData.numberOfGuests
            );
            setTables(availableTables);
        } catch (error) {
            console.error("Masa sorgulama hatası", error);
        } finally {
            setLoadingTables(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            toast.info("Rezervasyon yapmak için lütfen giriş yapınız.");
            navigate('/login');
            return;
        }
        
        const payload = {
            reservationDate: formData.reservationDate, 
            numberOfGuests: formData.numberOfGuests,
            specialRequests: formData.specialRequests || null,
            tableId: selectedTableId ? parseInt(selectedTableId) : 0,
            customerName: user.fullName || user.email,
            customerPhone: user.phoneNumber || "5555555555",
            status: 0,
            statusName: "Pending"
        };

        try {
            await api.post('/Reservation', payload);
            toast.success("Rezervasyon talebiniz alındı! Durumu profilinizden takip edebilirsiniz.");
            
            // Formu sıfırla
            setFormData({ reservationDate: '', numberOfGuests: 2, specialRequests: '' });
            setSelectedTableId('');
            setTables([]); // Masaları temizle
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

            {/* SAĞ TARAF: FORM */}
            <div 
                className="col-lg-6 d-flex align-items-center justify-content-center p-5"
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
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
                            <label className="form-label fw-bold small text-uppercase">
                                Masa Tercihi 
                                {loadingTables && <span className="spinner-border spinner-border-sm ms-2 text-warning"></span>}
                            </label>
                            
                            {/* Tarih seçilmediyse uyarı göster */}
                            {!formData.reservationDate ? (
                                <div className="text-muted small fst-italic p-2 border rounded bg-light">
                                    <i className="fas fa-info-circle me-1"></i>
                                    Müsait masaları görmek için lütfen önce tarih seçiniz.
                                </div>
                            ) : (
                                <select 
                                    className="form-select py-3"
                                    value={selectedTableId}
                                    onChange={e => setSelectedTableId(e.target.value)}
                                    disabled={loadingTables}
                                >
                                    <option value="">Otomatik Seçim (Müsaitlik Durumuna Göre)</option>
                                    {tables.map(t => (
                                        <option key={t.id} value={t.id}>
                                            Masa {t.tableNumber} ({t.capacity} Kişi)
                                        </option>
                                    ))}
                                    {/* Eğer liste boşsa ve tarih seçiliyse */}
                                    {tables.length === 0 && !loadingTables && (
                                        <option disabled>Seçilen saatte uygun masa yok.</option>
                                    )}
                                </select>
                            )}
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
                            <button 
                                type="submit" 
                                className="btn btn-dark w-100 py-3 text-uppercase fw-bold" 
                                style={{ letterSpacing: '2px' }}
                                disabled={loadingTables || (formData.reservationDate && tables.length === 0)}
                            >
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