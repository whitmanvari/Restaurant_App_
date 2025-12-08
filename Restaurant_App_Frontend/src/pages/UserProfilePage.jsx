import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import UserOrdersList from '../components/Profile/UserOrdersList';
import UserProfileForm from '../components/Profile/UserProfileForm';

export default function UserProfilePage({ isAdminView = false }) {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Eğer adminView ise varsayılan olarak 'settings' (Ayarlar) sekmesini aç
    // Değilse 'orders' (Siparişlerim) sekmesini aç
    const [activeTab, setActiveTab] = useState(isAdminView ? 'settings' : 'orders');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className="container mt-5 pt-5 mb-5 fade-in-up">
            <div className="row g-4">
                
                {/* SOL: Profil Kartı ve Menü */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 text-center">
                        <div className="mb-3 d-flex justify-content-center">
                            <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center display-4 fw-bold" style={{ width: '100px', height: '100px' }}>
                                {user?.fullName ? user.fullName.substring(0, 1).toUpperCase() : 'U'}
                            </div>
                        </div>
                        <h4 className="fw-bold">{user?.fullName}</h4>
                        <p className="text-muted mb-4">{user?.email}</p>
                        
                        <div className="list-group list-group-flush text-start mb-3">
                            {/* Eğer Admin Modundaysak "Siparişlerim" butonunu gizle */}
                            {!isAdminView && (
                                <button 
                                    className={`list-group-item list-group-item-action border-0 rounded mb-2 ${activeTab === 'orders' ? 'active bg-dark text-white' : ''}`}
                                    onClick={() => setActiveTab('orders')}
                                >
                                    <i className="fas fa-receipt me-2"></i> Siparişlerim
                                </button>
                            )}
                            
                            <button 
                                className={`list-group-item list-group-item-action border-0 rounded mb-2 ${activeTab === 'settings' ? 'active bg-dark text-white' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <i className="fas fa-user-cog me-2"></i> Profil Ayarları
                            </button>
                        </div>

                        {/* Admin Modunda Çıkış Yap butonu gereksiz olabilir (Navbar'da var), ama user için gerekli */}
                        {!isAdminView && (
                            <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt me-2"></i> Çıkış Yap
                            </button>
                        )}
                    </div>
                </div>

                {/* SAĞ: İçerik Alanı (Modüler Bileşenler) */}
                <div className="col-lg-8">
                    {/* Tablar arasında geçiş */}
                    {activeTab === 'orders' && !isAdminView && <UserOrdersList />}
                    {activeTab === 'settings' && <UserProfileForm />}
                </div>
            </div>
        </div>
    );
}