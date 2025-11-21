import React from 'react';
import '../styles/footer.scss';

export default function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row gy-5">
          
          {/* Kolon 1: Marka & Adres */}
          <div className="col-lg-4 col-md-6">
            <h5 style={{ fontFamily: 'Playfair Display' }}>LUNA RESTAURANT</h5>
            <p className="mb-4">
              Modern gastronomi ile geleneksel lezzetlerin buluşma noktası. 
              Unutulmaz anlar için sizi bekliyoruz.
            </p>
            <p>
              <i className="fas fa-map-marker-alt me-2 text-warning"></i>
              Bağdat Cad. No: 123, Kadıköy / İst
            </p>
            <p>
              <i className="fas fa-phone me-2 text-warning"></i>
              +90 (216) 123 45 67
            </p>
          </div>

          {/* Kolon 2: Hızlı Linkler */}
          <div className="col-lg-4 col-md-6 ps-lg-5">
            <h5>Hızlı Erişim</h5>
            <ul className="list-unstyled">
              <li><a href="/menu">Menü & Spesiyaller</a></li>
              <li><a href="/reservations">Rezervasyon Yap</a></li>
              <li><a href="/about">Hakkımızda</a></li>
              <li><a href="/contact">İletişim & Ulaşım</a></li>
            </ul>
          </div>

          {/* Kolon 3: Sosyal Medya */}
          <div className="col-lg-4 col-md-12">
            <h5>Bizi Takip Edin</h5>
            <p>Etkinlikler ve yeni menülerden haberdar olmak için sosyal medya hesaplarımız.</p>
            <div className="social-icons mt-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook"><i className="fab fa-facebook-f"></i></a>
            </div>
          </div>

        </div>

        <div className="footer-bottom text-center">
           <p>&copy; 2025 Luna Restaurant. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}