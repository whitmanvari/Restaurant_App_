import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, registerUser } from '../store/slices/authSlice';
import '../styles/auth.scss';

const AuthPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Redux state'inden verileri al
    const { status, error, isAuthenticated } = useSelector((state) => state.auth);
    
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    // Form States
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '', city: '', address: ''
    });

    // Sayfa URL'ine göre panel seçimi
    useEffect(() => {
        if (location.pathname === '/signup') {
            setIsRightPanelActive(true);
        } else {
            setIsRightPanelActive(false);
        }
    }, [location]);

    // Auth durumu ve Hata mesajlarını izle
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }

        // HATA YAKALAMA VE TOAST
        if (status === 'failed' && error) {
            console.log("🔔 TOAST İÇİN GELEN MESAJ:", error);
            
            // Error bir obje ise stringe çevir, yoksa direkt bas
            const messageToShow = typeof error === 'object' 
                ? JSON.stringify(error) 
                : error;

            // react-toastify ile göster
            toast.error(messageToShow, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [isAuthenticated, status, error, navigate]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(loginData));
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        // Basit Validasyon
        if (registerData.password !== registerData.confirmPassword) {
            toast.error("Şifreler eşleşmiyor!");
            return;
        }

        // Kayıt işlemini başlat
        const result = await dispatch(registerUser(registerData));

        // İşlem başarılıysa
        if (registerUser.fulfilled.match(result)) {
            toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
            setIsRightPanelActive(false); // Login ekranına dön
            navigate('/login');
        }
        // İşlem başarısızsa, yukarıdaki useEffect hatayı yakalayıp gösterecek.
    };

    return (
        <div className="auth-page-wrapper">
            <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
                
                {/* KAYIT OL FORM */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Hesap Oluştur</h1>
                        <p className="small text-muted mb-4">Lezzet dünyasına katılın</p>
                        
                        <input type="text" placeholder="Ad Soyad" value={registerData.fullName} onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})} required />
                        <input type="email" placeholder="Email" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} required />
                        
                        <div className="d-flex gap-2 w-100">
                             <input type="text" placeholder="Telefon" value={registerData.phoneNumber} onChange={(e) => setRegisterData({...registerData, phoneNumber: e.target.value})} required />
                             <input type="text" placeholder="Şehir" value={registerData.city} onChange={(e) => setRegisterData({...registerData, city: e.target.value})} required />
                        </div>
                        
                        <input type="text" placeholder="Adres" value={registerData.address} onChange={(e) => setRegisterData({...registerData, address: e.target.value})} />

                        <input type="password" placeholder="Şifre" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} required />
                        <input type="password" placeholder="Şifre Tekrar" value={registerData.confirmPassword} onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})} required />

                        <button type="submit" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Kaydediliyor...' : 'Kayıt Ol'}
                        </button>
                    </form>
                </div>

                {/* GİRİŞ YAP FORM */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLoginSubmit}>
                        <h1 className="mb-2">Hoşgeldiniz</h1>
                        <p className="small text-muted mb-4">Lütfen hesabınıza giriş yapın</p>
                        
                        <input type="email" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                        <input type="password" placeholder="Şifre" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                        
                        <a href="#" className="small text-muted my-2">Şifremi unuttum</a>
                        
                        <button type="submit" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                </div>

                {/* OVERLAY (Geçiş Paneli) */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Tekrar Merhaba!</h1>
                            <p>Zaten bir hesabınız var mı? Giriş yaparak lezzetlere ulaşın.</p>
                            <button className="ghost" onClick={() => navigate('/login')}>Giriş Yap</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Yeni Lezzetler Keşfet</h1>
                            <p>Henüz üye değil misiniz? Hemen kayıt olun ve özel fırsatlardan yararlanın.</p>
                            <button className="ghost" onClick={() => navigate('/signup')}>Kayıt Ol</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;