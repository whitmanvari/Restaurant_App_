import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Backend string email bekliyorsa
            await api.post('/Auth/forgot-password', JSON.stringify(email), {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success("Sıfırlama bağlantısı e-posta adresinize gönderildi.");
        } catch (error) {
            toast.error("İşlem başarısız. Lütfen emailinizi kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg border-0" style={{maxWidth:'400px', width:'100%'}}>
                <div className="text-center mb-4">
                    <h3 style={{fontFamily:'Playfair Display'}}>Şifremi Unuttum</h3>
                    <p className="text-muted small">E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="email" 
                            className="form-control py-2" 
                            placeholder="E-posta Adresi" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-dark w-100 py-2" disabled={loading}>
                        {loading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
                    </button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/login" className="small text-decoration-none text-secondary">
                        <i className="fas fa-arrow-left me-1"></i> Giriş sayfasına dön
                    </Link>
                </div>
            </div>
        </div>
    );
}