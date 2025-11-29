import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Gelen mesajları al (Yoksa varsayılanları kullan)
    const message = location.state?.message || "İşleminiz başarıyla tamamlandı.";
    const subMessage = location.state?.subMessage || "Yönlendiriliyorsunuz...";
    const returnPath = location.state?.returnPath || "/"; // Dönülecek yer
    const buttonText = location.state?.buttonText || "Anasayfaya Dön";

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(returnPath);
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate, returnPath]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center p-5 bg-white shadow-lg rounded fade-in-up" style={{maxWidth: '500px', width: '90%'}}>
                <div className="mb-4 text-success">
                    <i className="fas fa-check-circle fa-5x"></i>
                </div>
                <h2 className="mb-3" style={{fontFamily: 'Playfair Display'}}>Harika!</h2>
                <h5 className="text-muted mb-4">{message}</h5>
                
                <div className="alert alert-success border-0 bg-success bg-opacity-10 text-dark mb-4">
                    <i className="fas fa-info-circle me-2"></i>
                    {subMessage}
                </div>

                <button onClick={() => navigate(returnPath)} className="btn btn-dark px-5 py-2">
                    {buttonText}
                </button>
            </div>
        </div>
    );
}