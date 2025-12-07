import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function AdminSidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3>LUNA</h3>
                <small>Yönetim Paneli </small>
            </div>

            <ul className="sidebar-menu">
                <li className="menu-label">Yönetim</li>
                
                {/* TEK VE GÜÇLÜ LINK */}
                <li>
                    <NavLink to="/admin/tables" className={({ isActive }) => isActive ? 'active' : ''}>
                        <i className="fas fa-th-large"></i> Masa Yönetimi
                    </NavLink>
                </li>

                <li className="menu-label">Operasyon</li>
                <li>
                    <NavLink to="/admin/orders">
                        <i className="fas fa-concierge-bell"></i> Siparişler
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/reservations">
                        <i className="fas fa-calendar-check"></i> Rezervasyonlar
                    </NavLink>
                </li>

                <li className="menu-label">Veri & Rapor</li>
                <li>
                    <NavLink to="/admin/menu">
                        <i className="fas fa-utensils"></i> Menü
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/categories">
                        <i className="fas fa-tags"></i> Kategoriler
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/comments">
                        <i className="fas fa-comments"></i> Yorumlar
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/users">
                        <i className="fas fa-users"></i> Kullanıcılar
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/analytics">
                        <i className="fas fa-chart-pie"></i> Analitik
                    </NavLink>
                </li>
            </ul>

            <div className="sidebar-footer">
                <div className="user-info mb-3">
                    <img src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=c5a059&color=fff`} alt="Admin" />
                    <div>
                        <h6>{user?.fullName}</h6>
                        <small>Süper Yönetici</small>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100">
                    <i className="fas fa-sign-out-alt me-2"></i> Çıkış Yap
                </button>
            </div>
        </div>
    );
}