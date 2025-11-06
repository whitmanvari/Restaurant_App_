import React, { useState } from 'react';
import {loginUser} from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

function LoginPage() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault(); //formun sayfayı yeniden yüklemesini engelle
        dispatch(loginUser({email, password})); //authslice'daki loginUser eylemini tetikle dispatch et
    }
    return (
        <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Giriş Yap</h1>
              
              {/* Bootstrap formu */}
              <form onSubmit={handleSubmit}>
                
                {/* Email Alanı */}
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email Adresi</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                {/* Şifre Alanı */}
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">Şifre</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {/* Submit Butonu */}
                <button type="submit" className="btn btn-primary w-100">
                  Giriş Yap
                </button>
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}

export default LoginPage;