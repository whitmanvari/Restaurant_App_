import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center p-5">
                <div className="mb-4 text-warning">
                    <i className="fas fa-map-signs fa-5x"></i>
                </div>
                <h1 className="display-1 fw-bold" style={{fontFamily: 'Playfair Display'}}>404</h1>
                <h4 className="mb-3">Aradığınız Sayfa Bulunamadı</h4>
                <p className="text-muted mb-4" style={{maxWidth: '400px', margin: '0 auto'}}>
                    Gitmek istediğiniz sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir.
                </p>
                
                <button onClick={() => navigate('/')} className="btn btn-dark btn-lg px-5">
                    Anasayfaya Dön
                </button>
            </div>
        </div>
    );
}