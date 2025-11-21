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
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const { theme, toggleTheme } = useTheme();

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setShowUserMenu(false);
        navigate("/login");
    };

    // Navbar Sınıfları
    const navbarClass = `navbar navbar-expand-lg fixed-top navbar-custom ${scrolled || !isHomePage ? 'scrolled' : ''}`;

    return (
        <nav className={navbarClass}>
            <div className="container">

                {/* 1. LOGO */}
                <Link className="brand-logo" to="/">
                    LUNA
                </Link>

                {/* Mobil Menü Butonu */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                    aria-controls="navbarNav"
                    aria-expanded={!isNavCollapsed}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">

                    {/* 2. ORTA LİNKLER */}
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" end>Ana Sayfa</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/menu">Menü</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/reservations">Rezervasyon</NavLink>
                        </li>
                        {user?.role === 'Admin' && (
                            <li className="nav-item">
                                <NavLink className="nav-link text-warning" to="/admin">Yönetim</NavLink>
                            </li>
                        )}
                    </ul>

                    {/* 3. SAĞ Taraf (Tema, Sepet, User) */}
                    <ul className="navbar-nav align-items-center gap-3 right-nav">
                        
                        {/* Tema Değiştirici */}
                        <li className="nav-item">
                            <button
                                onClick={toggleTheme}
                                className="btn nav-link border-0 p-0 theme-btn"
                                title={theme === 'light' ? "Koyu Moda Geç" : "Açık Moda Geç"}
                            >
                                {theme === 'light' ? (
                                    <i className="fas fa-moon"></i>
                                ) : (
                                    <i className="fas fa-sun text-warning"></i>
                                )}
                            </button>
                        </li>

                        {/* Sepet İkonu */}
                        <li className="nav-item position-relative">
                            <Link to="/cart" className="nav-link p-0 cart-icon-wrapper">
                                <i className="fas fa-shopping-bag"></i>
                                {cartCount > 0 && (
                                    <span className="cart-badge">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </li>

                        {/* KULLANICI ALANI */}
                        {isAuthenticated ? (
                            <li className="nav-item dropdown position-relative">
                                <button
                                    className="user-profile-btn"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                                >
                                    <div className="avatar-wrapper">
                                        <img
                                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=c5a059&color=fff&size=128`}
                                            alt="avatar"
                                        />
                                    </div>
                                    <span className="user-name">{user?.fullName?.split(' ')[0] || 'Misafir'}</span>
                                    <i className={`fas fa-chevron-down ms-2 small transition-icon ${showUserMenu ? 'rotate' : ''}`}></i>
                                </button>

                                {/* Dropdown Menü */}
                                {showUserMenu && (
                                    <div className="custom-dropdown-menu">
                                        <div className="dropdown-header-area">
                                            <small>Hoşgeldin,</small>
                                            <strong>{user?.fullName}</strong>
                                        </div>
                                        <Link className="dropdown-item-custom" to="/profile">
                                            <i className="fas fa-user me-2"></i> Profilim
                                        </Link>
                                        <Link className="dropdown-item-custom" to="/my-orders">
                                            <i className="fas fa-receipt me-2"></i> Siparişlerim
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item-custom text-danger" onClick={handleLogout}>
                                            <i className="fas fa-sign-out-alt me-2"></i> Çıkış Yap
                                        </button>
                                    </div>
                                )}
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