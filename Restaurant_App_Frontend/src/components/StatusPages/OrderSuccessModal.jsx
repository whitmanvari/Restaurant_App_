import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccessModal({ show, onClose }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            // 3 saniye sonra otomatik olarak Menü'ye yönlendir
            const timer = setTimeout(() => {
                onClose(); // Modalı kapat
                navigate('/menu');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, navigate, onClose]);

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg text-center p-4">
                    <div className="modal-body">
                        <div className="mb-3 text-warning">
                            <i className="fas fa-clock fa-5x fa-spin" style={{ animationDuration: '3s' }}></i>
                        </div>
                        <h2 className="mb-2" style={{ fontFamily: 'Playfair Display', fontWeight: 'bold' }}>Siparişiniz Alındı!</h2>
                        <p className="lead text-muted">
                            Siparişiniz mutfağa iletildi ve <strong>onay bekleniyor.</strong>
                        </p>
                        <div className="alert alert-light border mt-3">
                            <small>Durumunu <b>Siparişlerim</b> sayfasından takip edebilirsiniz.</small>
                        </div>
                        <p className="text-muted small mt-3">Menüye yönlendiriliyorsunuz...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}