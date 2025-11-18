import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../store/slices/authSlice';

function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //auth slicedan status ve error'u dinle
    const {status, error, isAuthenticated} = useSelector((state) => state.auth);

    const [formData, setFromData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    //form değişikliklerini state e yaz
    const handleChange = (e) => {
        setFromData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword) {
            toast.error('Şifreler eşleşmiyor!');
            return;
        }
        dispatch(registerUser(formData));
    }

    useEffect(() => {
    // Kayıt başarılı olduysa
        if (status === 'succeeded' && !error) {
        toast.success('Kayıt başarılı! Lütfen giriş yapın.');
        navigate('/login'); // Login sayfasına yönlendir
        }
    // Kayıt başarısız olduysa
        if (status === 'failed' && error) {
        toast.error(error); // Backend'den gelen hatayı (authService) göster
        }
        // Kullanıcı zaten giriş yapmışsa
        if (isAuthenticated) {
        navigate('/');
        }
    }, [status, error, isAuthenticated, navigate]);

    return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Kayıt Ol</h1>
              <form onSubmit={handleSubmit}>

                {/* FullName Alanı */}
                <div className="mb-3">
                  <label className="form-label">Ad Soyad</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Email Alanı */}
                <div className="mb-3">
                  <label className="form-label">Email Adresi</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                  />
                </div>
                
                {/* Şifre Alanı */}
                <div className="mb-3">
                  <label className="form-label">Şifre</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Şifre Tekrar Alanı */}
                <div className="mb-3">
                  <label className="form-label">Şifre Tekrar</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                  />
                </div>
                
                {/* Submit Butonu */}
                <button 
                  type="submit" 
                  className="btn btn-success w-100"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
                </button>
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
