import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/home.scss';

function HomePage() {
    // Giriş yapan kullanıcı varsa ismini alalım
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="home-container">

            {/* 1. HERO SECTION */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Lezzetin <span>Sanata</span> Dönüştüğü Yer</h1>
                    {user ? (
                        <p>Tekrar hoş geldiniz, {user.fullName || user.email}. Sizin için bir masa hazırladık.</p>
                    ) : (
                        <p>Modern gastronomi ve geleneksel tatların eşsiz uyumu.</p>
                    )}

                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/menu" className="btn-hero">Menüyü Keşfet</Link>
                        <Link to="/reservations" className="btn-hero" style={{ borderColor: '#fff', color: '#fff' }}>Rezervasyon</Link>
                    </div>
                </div>
            </section>

            {/* 2. ABOUT / STORY SECTION */}
            <section className="about-section">
                <h2>Hikayemiz</h2>
                <div className="separator"></div>
                <p>
                    2025 yılında kurulan Restaurant App, sadece karın doyurmayı değil, ruhu beslemeyi amaçlar.
                    Yerel üreticilerden aldığımız en taze malzemeleri, usta şeflerimizin modern yorumlarıyla birleştiriyoruz.
                    Her tabak, anlatılmayı bekleyen bir hikaye.
                </p>
            </section>

            {/* 3. FEATURED / CHEF'S SELECTION */}
            <section className="featured-section">
                <h2 className="section-title">Şefin İmzası</h2>

                <div className="dish-grid">
                    {/* Kart 1: Sushi / Bowl Görseli vardı */}
                    <div className="dish-card">
                        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop" alt="Poke Bowl" />
                        <div className="dish-info">
                            <h4>Pasifik Somon Bowl</h4>
                            <p className="text-muted small">Taze Norveç somonu, avokado, edamame, mango ve ponzu sos eşliğinde.</p>
                            <span className="price">320 ₺</span>
                        </div>
                    </div>

                    {/* Kart 2: Et Görseli vardı */}
                    <div className="dish-card">
                        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop" alt="Steak" />
                        <div className="dish-info">
                            <h4>Dry Aged Antrikot</h4>
                            <p className="text-muted small">28 gün dinlendirilmiş, trüf mantarlı patates püresi ve demi-glace sos ile.</p>
                            <span className="price">750 ₺</span>
                        </div>
                    </div>

                    {/* Kart 3: Tatlı Görseli vardı (Krep/Pancake gibi duruyordu, değiştirelim) */}
                    <div className="dish-card">
                        {/* Görseli daha şık bir tatlıyla değiştirdim */}
                        <img src="https://images.unsplash.com/photo-1551024601-bec0273e132e?q=80&w=2574&auto=format&fit=crop" alt="Dessert" />
                        <div className="dish-info">
                            <h4>Çikolatalı Sufle</h4>
                            <p className="text-muted small">%70 Belçika çikolatası, yanında ev yapımı vanilyalı dondurma.</p>
                            <span className="price">220 ₺</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FOOTER */}
            <footer className="text-center py-5 bg-dark text-white mt-auto">
                <p className="mb-0 small opacity-50">© 2025 Restaurant App. Tüm hakları saklıdır.</p>
            </footer>

        </div>
    );
}

export default HomePage;