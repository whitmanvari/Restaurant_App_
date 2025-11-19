import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, registerUser } from '../store/slices/authSlice';
import '../styles/auth.scss';

function AuthPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { status, error, isAuthenticated } = useSelector((state) => state.auth);

    // URL '/login' ise panel sağda değil (Login açık), '/signup' ise panel sağda (Register açık)
    // Bu sayede link ile gelen doğru paneli görür.
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    useEffect(() => {
        if (location.pathname === '/signup') {
            setIsRightPanelActive(true);
        } else {
            setIsRightPanelActive(false);
        }
    }, [location]);

    // --- REGISTER STATE ---
    const [regData, setRegData] = useState({
        fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '', city: ''
    });

    // --- LOGIN STATE ---
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    // --- HANDLERS ---
    const handleRegChange = (e) => setRegData({ ...regData, [e.target.name]: e.target.value });
    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (regData.password !== regData.confirmPassword) {
            toast.error("Şifreler eşleşmiyor."); return;
        }
        // Basit password check
        if (regData.password.length < 6) {
            toast.warning("Şifre en az 6 karakter olmalı."); return;
        }

        // Kayıt işlemi
        const resultAction = await dispatch(registerUser(regData));
        if (registerUser.fulfilled.match(resultAction)) {
            toast.success("Kayıt başarılı! Lütfen giriş yapın.");
            setIsRightPanelActive(false); // Başarılı olunca Login paneline kay
            navigate('/login'); // URL'i de güncelle
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(loginData));
    };

    // Login başarılıysa ana sayfaya git
    useEffect(() => {
        if (isAuthenticated) navigate('/');
        if (status === 'failed' && error) toast.error(typeof error === 'string' ? error : 'İşlem başarısız.');
    }, [isAuthenticated, status, error, navigate]);

    // Panel Geçiş Fonksiyonları
    const switchToSignUp = () => {
        setIsRightPanelActive(true);
        navigate('/signup');
    }

    const switchToSignIn = () => {
        setIsRightPanelActive(false);
        navigate('/login');
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">

                {/* --- SIGN UP (KAYIT) FORMU --- */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Hesap Oluştur</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-google"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>veya email ile kayıt ol</span>

                        <input type="text" name="fullName" placeholder="Ad Soyad" value={regData.fullName} onChange={handleRegChange} required className="form-control" />
                        <input type="email" name="email" placeholder="Email" value={regData.email} onChange={handleRegChange} required className="form-control" />

                        {/* Yan yana inputlar için küçük grid */}
                        <div className="d-flex w-100 gap-2">
                            <input type="text" name="city" placeholder="Şehir" value={regData.city} onChange={handleRegChange} className="form-control" />
                            <input type="text" name="phoneNumber" placeholder="Tel" value={regData.phoneNumber} onChange={handleRegChange} className="form-control" />
                        </div>

                        <input type="password" name="password" placeholder="Şifre" value={regData.password} onChange={handleRegChange} required className="form-control" />
                        <input type="password" name="confirmPassword" placeholder="Şifre Tekrar" value={regData.confirmPassword} onChange={handleRegChange} required className="form-control" />

                        <button type="submit" disabled={status === 'loading'}>Kaydol</button>
                    </form>
                </div>

                {/* --- SIGN IN (GİRİŞ) FORMU --- */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Giriş Yap</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-google"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>hesabınızla giriş yapın</span>

                        <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required className="form-control" />
                        <input type="password" name="password" placeholder="Şifre" value={loginData.password} onChange={handleLoginChange} required className="form-control" />

                        <a href="#" className="mt-2 text-muted text-decoration-none small">Şifremi unuttum?</a>
                        <button type="submit" disabled={status === 'loading'}>Giriş</button>
                    </form>
                </div>

                {/* --- OVERLAY (KAYAN RESİM) --- */}
                <div className="overlay-container">
                    <div className="overlay">
                        {/* SOL OVERLAY: Giriş paneli açıkken görünür (Kaydolmaya davet eder) */}
                        <div className="overlay-panel overlay-left">
                            <h1>Tekrar Hoşgeldiniz!</h1>
                            <p>Restoranımızın lezzetleriyle buluşmak için giriş yapın.</p>
                            <button className="ghost" onClick={switchToSignIn}>Giriş Yap</button>
                        </div>

                        {/* SAĞ OVERLAY: Kayıt paneli açıkken görünür (Giriş yapmaya davet eder) */}
                        <div className="overlay-panel overlay-right">
                            <h1>Merhaba, Lezzet Tutkunu!</h1>
                            <p>Kişisel bilgilerinizi girin ve bizimle lezzet yolculuğuna başlayın.</p>
                            <button className="ghost" onClick={switchToSignUp}>Kaydol</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;