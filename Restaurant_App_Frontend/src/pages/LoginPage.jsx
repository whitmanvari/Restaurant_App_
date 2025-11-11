import { useEffect, useState } from 'react';
import {loginUser} from '../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); //use navigate hooku çağırılır

    const {status, isAuthenticated, error} = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault(); //formun sayfayı yeniden yüklemesini engelle
        dispatch(loginUser({email, password})); //authslice'daki loginUser eylemini tetikle dispatch et
    }
    useEffect(()=> {
        if(status === 'failed') {
            toast.error(error || 'Email veya şifre hatalı!')
        }
        if(status === 'succeeded' || isAuthenticated) {
            toast.success('Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...')
            navigate('/');
        }
    }, [status, isAuthenticated, error, navigate]);
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
                    disabled={status=='loading'} 
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
                    disabled = {status === 'loading'} //yüklenirken butonu kilitle
                  />
                </div>
                
                {/* Submit Butonu */}
                <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={status === 'loading'}>
                  <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Giriş Yapılıyor...
                    </> : (
                    'Giriş Yap' //
                  )
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