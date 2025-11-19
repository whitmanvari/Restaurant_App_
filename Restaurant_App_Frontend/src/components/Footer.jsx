import React from 'react';
import '../styles/footer.scss';

export default function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row gy-4">
          
          {/* Kolon 1: Adres */}
          <div className="col-md-4">
            <h5>Adres & İletişim</h5>
            <p>
              Fenerbahçe Mah. Bağdat Cad.<br />
              No: 123, Kadıköy<br />
              İstanbul, Türkiye
            </p>
            <p>
              <strong>Tel:</strong> +90 (216) 123 45 67<br />
              <strong>Email:</strong> info@restaurantapp.com
            </p>
          </div>

          {/* Kolon 2: Saatler */}
          <div className="col-md-4">
            <h5>Çalışma Saatleri</h5>
            <ul className="list-unstyled">
              <li>Pazartesi - Perşembe: 12:00 - 23:00</li>
              <li>Cuma - Cumartesi: 12:00 - 01:00</li>
              <li>Pazar: 10:00 - 23:00 (Brunch)</li>
            </ul>
          </div>

          {/* Kolon 3: Linkler & Sosyal */}
          <div className="col-md-4">
            <h5>Bizi Takip Edin</h5>
            <p>En yeni lezzetlerimizden ve etkinliklerimizden haberdar olun.</p>
            <div className="social-icons mb-3">
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-facebook-f"></i></a>
            </div>
            <p className="small text-muted">Newsletter aboneliği yakında...</p>
          </div>

        </div>

        <div className="footer-bottom text-center">
           <p>&copy; 2025 Restaurant App. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}