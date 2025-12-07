import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccessModal({ show, onClose, customMessage }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
                navigate('/my-orders'); 
            }, 6000); 
            return () => clearTimeout(timer);
        }
    }, [show, navigate, onClose]);
    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 9999 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg text-center p-5">
                    <div className="modal-body">
                        <div className="mb-4 text-success animate-bounce">
                            <i className="fas fa-check-circle fa-5x"></i>
                        </div>
                        <h2 className="mb-3 fw-bold" style={{ fontFamily: 'Playfair Display' }}>Sipariş Alındı!</h2>
                        <p className="lead text-muted mb-4">
                            {customMessage || "Siparişiniz başarıyla oluşturuldu ve onaya gönderildi."}
                        </p>
                        
                        <div className="alert alert-light border mt-3 small text-muted">
                            <i className="fas fa-info-circle me-2"></i>
                            {/* DÜZELTME BURADA: > yerine &gt; kullanıldı */}
                            Sipariş durumunu <b>Profil &gt; Siparişlerim</b> sayfasından takip edebilirsiniz.
                        </div>

                        <div className="mt-4">
                            <button onClick={() => navigate('/my-orders')} className="btn btn-dark me-2 px-4">Siparişlerim</button>
                            <button onClick={() => navigate('/menu')} className="btn btn-outline-secondary px-4">Menüye Dön</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}