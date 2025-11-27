import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import '../styles/navbar.scss';
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart);

    const cartCount = Array.isArray(cart?.items) ? cart.items.length : 0;

    const [scrolled, setScrolled] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const { theme, toggleTheme } = useTheme();

    // MENÜ STATE'LERİ (Dropdownları manuel kontrol ediyoruz)
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false); // Admin menüsü için state

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setShowUserMenu(false);
        navigate("/login");
    };

    const navbarClass = `navbar navbar-expand-lg fixed-top navbar-custom ${scrolled || !isHomePage ? 'scrolled' : ''}`;

    return (
        <nav className={navbarClass}>
            <div className="container">
                {/* 1. LOGO */}
                <Link className="brand-logo" to="/">
                    LUNA
                </Link>

                <button className="navbar-toggler" type="button" onClick={() => setIsNavCollapsed(!isNavCollapsed)}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                    <ul className="navbar-nav mx-auto align-items-center">
                        <li className="nav-item"><NavLink className="nav-link" to="/" end>Ana Sayfa</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/menu">Menü</NavLink></li>
                        
                        {/*ADMIN MENÜSÜ (Manual Toggle) */}
                        {user?.role === 'Admin' ? (
                            <li className="nav-item dropdown position-relative">
                                <button 
                                    className="nav-link btn btn-link text-warning dropdown-toggle"
                                    onClick={() => setShowAdminMenu(!showAdminMenu)} // Tıklayınca aç/kapa
                                    onBlur={() => setTimeout(() => setShowAdminMenu(false), 200)} // Odak gidince kapat
                                    style={{ textDecoration: 'none', boxShadow: 'none' }}
                                >
                                    Yönetim
                                </button>
                                {/* 'show' classını state'e göre ekliyoruz */}
                                <ul className={`dropdown-menu border-0 shadow ${showAdminMenu ? 'show' : ''}`} style={{marginTop: '10px'}}>
                                    <li><Link className="dropdown-item" to="/admin"><i className="fas fa-chart-line me-2 text-primary"></i> Panel</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/reservations"><i className="fas fa-calendar-check me-2 text-success"></i> Rezervasyonlar</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/orders"><i className="fas fa-bell me-2 text-warning"></i> Siparişler</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/users"><i className="fas fa-users me-2 text-info"></i> Kullanıcılar</Link></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><Link className="dropdown-item" to="/admin/settings"><i className="fas fa-cogs me-2 text-secondary"></i> Ayarlar</Link></li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item"><NavLink className="nav-link" to="/reservations">Rezervasyon</NavLink></li>
                        )}
                    </ul>

                    <ul className="navbar-nav align-items-center gap-3 right-nav">
                        {/* TEMA */}
                        <li className="nav-item">
                            <button onClick={toggleTheme} className="btn nav-link border-0 p-0 theme-btn" title="Tema Değiştir">
                                {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun text-warning"></i>}
                            </button>
                        </li>

                        {/* SEPET */}
                        <li className="nav-item position-relative">
                            <Link to="/cart" className="nav-link p-0 cart-icon-wrapper">
                                <i className="fas fa-shopping-bag fs-5"></i>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                        </li>

                        {/* AUTH / USER MENÜSÜ */}
                        {isAuthenticated ? (
                            <li className="nav-item dropdown position-relative">
                                <button 
                                    className="nav-link btn btn-link user-profile-btn d-flex align-items-center gap-2" 
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                                    style={{ textDecoration: 'none', boxShadow: 'none' }}
                                >
                                    <div className="avatar-wrapper">
                                        <img src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=c5a059&color=fff`} alt="avatar" />
                                    </div>
                                    <span className="user-name d-none d-md-block">
                                        {user?.role === 'Admin' ? 'Yönetici' : user?.fullName?.split(' ')[0]}
                                    </span>
                                </button>
                                
                                <ul className={`dropdown-menu dropdown-menu-end border-0 shadow ${showUserMenu ? 'show' : ''}`} style={{marginTop: '10px'}}>
                                    <li className="px-3 py-2 text-center border-bottom">
                                        <small className="text-muted d-block">Hoşgeldin</small>
                                        <strong>{user?.fullName}</strong>
                                        <span className={`badge ms-2 ${user?.role === 'Admin' ? 'bg-danger' : 'bg-secondary'}`}>{user?.role === 'Admin' ? 'Yönetici' : 'Üye'}</span>
                                    </li>
                                    <li><Link className="dropdown-item py-2" to="/profile"><i className="fas fa-user me-2 text-muted"></i> Profilim</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/my-orders"><i className="fas fa-receipt me-2 text-muted"></i> Siparişlerim</Link></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i> Çıkış Yap</button></li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn-auth-custom" to="/login">Giriş Yap</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}