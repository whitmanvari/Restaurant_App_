import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { productService } from '../services/productService';
import { getImageUrl } from '../utils/imageHelper';
import '../styles/home.scss';

const HomePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    
    // Scroll için Referans
    const aboutRef = useRef(null);

    // Unsplash Linkleri
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop",
            title: "LUNA",
            subtitle: "MODERN GASTRONOMİ",
            description: "Geleneksel lezzetleri modern dokunuşlarla yeniden keşfedin."
        },
        {
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop", // Daha şık bir masa görseli
            title: "EŞSİZ DENEYİM",
            subtitle: "ŞEFİN ÖZEL MENÜSÜ", 
            description: "Mevsimin en taze ürünleriyle hazırlanan imza tabaklar."
        },
        {
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop",
            title: "ATMOSFER",
            subtitle: "UNUTULMAZ AKŞAMLAR",
            description: "Özel davetleriniz için büyüleyici bir ortam."
        }
    ];

    useEffect(() => {
        loadFeaturedProducts();
        
        // Otomatik Slider (6 Saniye)
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000); 

        return () => clearInterval(interval);
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            const products = await productService.getMostPopular(3);
            setFeaturedProducts(products);
        } catch (error) {
            console.error('Featured products error:', error);
        }
    };

    const scrollToAbout = () => {
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="premium-homepage">
            
            {/* 1. HERO SLIDER */}
            <section className="hero-slider-section">
                <div className="slider-background">
                    {slides.map((slide, index) => (
                        <div 
                            key={index}
                            className={`slide-bg ${index === currentSlide ? 'active' : ''}`}
                            style={{ 
                                backgroundImage: `url('${slide.image}')`, 
                                zIndex: index === currentSlide ? 1 : 0 
                            }}
                        ></div>
                    ))}
                </div>

                <div className="slide-content">
                    <h1 className="main-title">{slides[currentSlide].title}</h1>
                    <div className="subtitle-line">{slides[currentSlide].subtitle}</div>
                    <p className="hero-description">{slides[currentSlide].description}</p>
                    
                    <div className="hero-buttons">
                        <Link to="/menu" className="btn-hero gold">Menüyü Gör</Link>
                        <Link to="/reservations" className="btn-hero">Rezervasyon</Link>
                    </div>
                </div>

                <div className="scroll-indicator" onClick={scrollToAbout}>
                    <div className="mouse-icon"></div>
                    <small>Keşfet</small>
                </div>
            </section>

            {/* 2. ABOUT SECTION */}
            <section ref={aboutRef} className="about-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="pe-lg-5">
                                <div className="section-header">
                                    <h5>Bizim Hikayemiz</h5>
                                    <h2>Lezzetin Sanata Dönüştüğü Yer</h2>
                                </div>
                                <p className="lead-text">
                                    2025 yılında kurulan LUNA, yerel üreticilerden temin edilen en taze malzemeleri 
                                    modern pişirme teknikleriyle buluşturuyor. Her tabak, şeflerimizin tutkusunu 
                                    ve ustalığını yansıtan bir sanat eseri.
                                </p>
                                <div className="stats-row">
                                    <div className="stat">
                                        <h3>25+</h3>
                                        <p>Yıllık Deneyim</p>
                                    </div>
                                    <div className="stat">
                                        <h3>15</h3>
                                        <p>Ödüllü Şef</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-images-wrapper">
                                <img 
                                    src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=2670&auto=format&fit=crop" 
                                    className="img-lg" 
                                    alt="Restoran Şefi"
                                />
                                <img 
                                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop" 
                                    className="img-sm" 
                                    alt="Gurme Tabak"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURED MENU (Şefin Seçimi) */}
            <section className="featured-menu-section">
                <div className="container">
                    <div className="section-title">
                        <h2>Şefin İmzası</h2>
                        <div className="divider"></div>
                        <p>Misafirlerimizin en çok beğendiği favori lezzetler</p>
                    </div>

                    <div className="menu-grid">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="menu-item-card">
                                <div className="card-img">
                                    <img src={getImageUrl(product.imageUrls?.[0])} alt={product.name} />
                                    <div className="price-badge">{product.price} ₺</div>
                                </div>
                                <div className="card-body">
                                    <h4>{product.name}</h4>
                                    <div className="rating">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fas fa-star ${i < Math.round(product.averageRating || 5) ? '' : 'text-muted opacity-25'}`}></i>
                                        ))}
                                    </div>
                                    <p>{product.description.substring(0, 60)}...</p>
                                    <Link to="/menu" className="btn-link">Detaylı İncele</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link to="/menu" className="btn btn-dark">Tüm Menüyü Görüntüle</Link>
                    </div>
                </div>
            </section>

            {/* 4. EXPERIENCE SECTION */}
            <section className="experience-section">
                <div className="exp-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2670&auto=format&fit=crop')"}}></div>
                <div className="exp-content">
                    <h2>Eşsiz Bir Deneyim</h2>
                    
                    <div className="feature-item">
                        <i className="fas fa-wine-glass"></i>
                        <div>
                            <h5>Özel Şarap Kavı</h5>
                            <p>Dünyanın dört bir yanından seçilmiş, ödüllü şarap koleksiyonu.</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <i className="fas fa-music"></i>
                        <div>
                            <h5>Canlı Müzik</h5>
                            <p>Hafta sonları piyano ve caz eşliğinde huzurlu akşam yemekleri.</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <i className="fas fa-leaf"></i>
                        <div>
                            <h5>Sürdürülebilir Mutfak</h5>
                            <p>Atıksız mutfak prensibi ve %100 organik yerel malzeme kullanımı.</p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <Link to="/reservations" className="btn btn-outline-light me-3">Rezervasyon</Link>
                        <Link to="/contact" className="btn btn-link text-white">İletişim</Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;