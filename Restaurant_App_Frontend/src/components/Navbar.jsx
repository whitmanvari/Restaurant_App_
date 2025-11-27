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

    // Dropdown Stateleri
    const [showDataMenu, setShowDataMenu] = useState(false);
    const [showOpsMenu, setShowOpsMenu] = useState(false);
    const [showReportMenu, setShowReportMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isHomePage = location.pathname === '/';
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const navbarClass = `navbar navbar-expand-lg fixed-top navbar-custom ${scrolled || !isHomePage ? 'scrolled' : ''}`;

    return (
        <nav className={navbarClass}>
            <div className="container">
                <Link className="brand-logo" to="/">LUNA</Link>

                <button className="navbar-toggler" type="button" onClick={() => setIsNavCollapsed(!isNavCollapsed)}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                    <ul className="navbar-nav mx-auto align-items-center">
                        {/* HERKES İÇİN LİNKLER */}
                        <li className="nav-item"><NavLink className="nav-link" to="/" end>Ana Sayfa</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/menu">Menü</NavLink></li>

                        {/* --- ADMİN MENÜSÜ --- */}
                        {isAdmin ? (
                            <>
                                {/* PANEL (MASALAR) */}
                                <li className="nav-item">
                                    <NavLink className="nav-link text-warning fw-bold" to="/admin">
                                        <i className="fas fa-th me-1"></i> Panel
                                    </NavLink>
                                </li>

                                {/* VERİ YÖNETİMİ DROPDOWN */}
                                <li className="nav-item dropdown position-relative">
                                    <button 
                                        className="nav-link btn btn-link dropdown-toggle"
                                        onClick={() => setShowDataMenu(!showDataMenu)}
                                        onBlur={() => setTimeout(() => setShowDataMenu(false), 200)}
                                    >
                                        Veri Yönetimi
                                    </button>
                                    <ul className={`dropdown-menu border-0 shadow ${showDataMenu ? 'show' : ''}`}>
                                        <li><Link className="dropdown-item" to="/admin/menu"><i className="fas fa-utensils me-2 text-muted"></i> Ürünler</Link></li>
                                        <li><Link className="dropdown-item" to="/admin/categories"><i className="fas fa-tags me-2 text-muted"></i> Kategoriler</Link></li>
                                        <li><Link className="dropdown-item" to="/admin/table-config"><i className="fas fa-chair me-2 text-muted"></i> Masa Düzeni</Link></li>
                                        <li><hr className="dropdown-divider"/></li>
                                        <li><Link className="dropdown-item" to="/admin/users"><i className="fas fa-users me-2 text-muted"></i> Kullanıcılar</Link></li>
                                    </ul>
                                </li>

                                {/* OPERASYON DROPDOWN */}
                                <li className="nav-item dropdown position-relative">
                                    <button 
                                        className="nav-link btn btn-link dropdown-toggle"
                                        onClick={() => setShowOpsMenu(!showOpsMenu)}
                                        onBlur={() => setTimeout(() => setShowOpsMenu(false), 200)}
                                    >
                                        Operasyon
                                    </button>
                                    <ul className={`dropdown-menu border-0 shadow ${showOpsMenu ? 'show' : ''}`}>
                                        <li><Link className="dropdown-item" to="/admin/reservations"><i className="fas fa-calendar-check me-2 text-success"></i> Rezervasyonlar</Link></li>
                                        <li><Link className="dropdown-item" to="/admin/orders"><i className="fas fa-bell me-2 text-warning"></i> Siparişler</Link></li>
                                    </ul>
                                </li>

                                {/* RAPORLAR DROPDOWN */}
                                <li className="nav-item dropdown position-relative">
                                    <button 
                                        className="nav-link btn btn-link dropdown-toggle"
                                        onClick={() => setShowReportMenu(!showReportMenu)}
                                        onBlur={() => setTimeout(() => setShowReportMenu(false), 200)}
                                    >
                                        Raporlar
                                    </button>
                                    <ul className={`dropdown-menu border-0 shadow ${showReportMenu ? 'show' : ''}`}>
                                        <li><Link className="dropdown-item" to="/admin/analytics"><i className="fas fa-chart-pie me-2 text-info"></i> Analitikler</Link></li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item"><NavLink className="nav-link" to="/reservations">Rezervasyon</NavLink></li>
                        )}
                    </ul>

                    {/* SAĞ TARAF (User/Cart) */}
                    <ul className="navbar-nav align-items-center gap-3 right-nav">
                        <li className="nav-item">
                            <button onClick={toggleTheme} className="btn nav-link border-0 p-0 theme-btn">
                                {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun text-warning"></i>}
                            </button>
                        </li>
                        <li className="nav-item position-relative">
                            <Link to="/cart" className="nav-link p-0 cart-icon-wrapper">
                                <i className="fas fa-shopping-bag fs-5"></i>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                        </li>

                        {/* AUTH / USER */}
                        {isAuthenticated ? (
                            <li className="nav-item dropdown position-relative">
                                <button 
                                    className="user-profile-btn" 
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                                >
                                    <div className="avatar-wrapper">
                                        <img src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=c5a059&color=fff`} alt="avatar" />
                                    </div>
                                    <span className="user-name">{user?.role === 'Admin' ? 'Yönetici' : user?.fullName?.split(' ')[0]}</span>
                                    <i className={`fas fa-chevron-down ms-2 small ${showUserMenu ? 'rotate' : ''}`}></i>
                                </button>
                                <ul className={`dropdown-menu dropdown-menu-end border-0 shadow ${showUserMenu ? 'show' : ''}`} style={{marginTop:'10px'}}>
                                    <li className="px-3 py-2 text-center border-bottom">
                                        <strong className="d-block">{user?.fullName}</strong>
                                        <span className="badge bg-secondary">{user?.role === 'Admin' ? 'Yönetici' : 'Üye'}</span>
                                    </li>
                                    {/* AYARLAR LINKI BURADA (Profil) */}
                                    <li><Link className="dropdown-item py-2" to="/profile"><i className="fas fa-user-cog me-2"></i> Ayarlar</Link></li>
                                    {!isAdmin && <li><Link className="dropdown-item py-2" to="/my-orders"><i className="fas fa-receipt me-2"></i> Siparişlerim</Link></li>}
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i> Çıkış Yap</button></li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item"><Link className="btn-auth-custom" to="/login">Giriş Yap</Link></li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}