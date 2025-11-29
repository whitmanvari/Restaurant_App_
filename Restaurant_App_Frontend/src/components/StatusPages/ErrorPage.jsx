import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ErrorPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const message = location.state?.message || "Beklenmedik bir hata oluştu.";
    const errorCode = location.state?.errorCode || "500";

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center p-5 bg-white shadow-lg rounded fade-in-up" style={{maxWidth: '500px', width: '90%'}}>
                <div className="mb-4 text-danger">
                    <i className="fas fa-exclamation-triangle fa-5x"></i>
                </div>
                <h1 className="display-1 fw-bold text-secondary">{errorCode}</h1>
                <h3 className="mb-3" style={{fontFamily: 'Playfair Display'}}>Üzgünüz, Bir Sorun Oluştu</h3>
                <p className="text-muted mb-4">{message}</p>
                
                <div className="d-flex gap-2 justify-content-center">
                    <button onClick={() => navigate(-1)} className="btn btn-outline-secondary px-4">
                        Geri Dön
                    </button>
                    <button onClick={() => navigate('/')} className="btn btn-dark px-4">
                        Anasayfa
                    </button>
                </div>
            </div>
        </div>
    );
}