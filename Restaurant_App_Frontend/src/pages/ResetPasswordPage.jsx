import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.warning("Şifreler uyuşmuyor."); return;
        }
        
        setLoading(true);
        try {
            await api.post('/Auth/reset-password', {
                email: email,
                token: token,
                newPassword: password
            });
            toast.success("Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz.");
            navigate('/login');
        } catch (error) {
            toast.error("Şifre sıfırlama başarısız. Linkin süresi dolmuş olabilir.");
        } finally {
            setLoading(false);
        }
    };

    if(!token || !email) return <div className="text-center mt-5">Geçersiz bağlantı.</div>;

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{maxWidth:'400px', width:'100%'}}>
                <h3 className="text-center mb-3" style={{fontFamily:'Playfair Display'}}>Yeni Şifre Belirle</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="password" class="form-control" placeholder="Yeni Şifre" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <input type="password" class="form-control" placeholder="Şifre Tekrar" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                        {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                    </button>
                </form>
            </div>
        </div>
    );
}