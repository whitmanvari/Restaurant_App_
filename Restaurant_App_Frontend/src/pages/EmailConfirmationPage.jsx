import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';

export default function EmailConfirmationPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error

    useEffect(() => {
        const confirm = async () => {
            const uid = searchParams.get('uid');
            const t = searchParams.get('t');

            if (!uid || !t) {
                setStatus('error');
                return;
            }

            try {
                // Backend'e onaya gönder
                await api.post('/Auth/confirm-email', { userId: uid, token: t });
                setStatus('success');
                toast.success("Hesabınız doğrulandı! Giriş yapılıyor...");
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        };

        confirm();
    }, [searchParams, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-5 shadow text-center" style={{maxWidth: '500px'}}>
                {status === 'loading' && (
                    <>
                        <div className="spinner-border text-warning mb-3" role="status"></div>
                        <h4>Doğrulanıyor...</h4>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <i className="fas fa-check-circle fa-5x text-success mb-3"></i>
                        <h3 className="text-success">Başarılı!</h3>
                        <p>E-posta adresiniz doğrulandı. Giriş sayfasına yönlendiriliyorsunuz.</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <i className="fas fa-times-circle fa-5x text-danger mb-3"></i>
                        <h3 className="text-danger">Hata!</h3>
                        <p>Doğrulama bağlantısı geçersiz veya süresi dolmuş.</p>
                        <button onClick={() => navigate('/login')} className="btn btn-dark mt-3">Giriş'e Dön</button>
                    </>
                )}
            </div>
        </div>
    );
}