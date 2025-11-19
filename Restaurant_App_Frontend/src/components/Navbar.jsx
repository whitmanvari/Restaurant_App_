import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import '../styles/navbar.scss';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart);

    const cartCount = Array.isArray(cart?.items) ? cart.items.length : 0;

    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

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

    return (
        <nav className={`navbar navbar-expand-lg fixed-top navbar-custom ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">

                {/* 1. SOL: LOGO */}
                <Link className="brand-logo" to="/">
                    Restaur<span>ant</span>
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
                    <span className="navbar-toggler-icon custom-toggler-icon"></span>
                </button>

                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">

                    {/* 2. ORTA: LİNKLER */}
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

                    {/* 3. SAĞ: SEPET & AUTH */}
                    <ul className="navbar-nav align-items-center gap-3">

                        <li className="nav-item position-relative">
                            <Link to="/cart" className="nav-link p-0">
                                <i className="fas fa-shopping-bag fs-5"></i>
                                {cartCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </li>

                        {isAuthenticated ? (
                            <li className="nav-item dropdown position-relative">
                                <button
                                    className="user-dropdown-btn"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                                >
                                    <img
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=c5a059&color=fff`}
                                        alt="avatar"
                                    />
                                    <span className="d-none d-md-inline">{user?.fullName || user?.email?.split('@')[0]}</span>
                                </button>
                                {showUserMenu && (
                                    <div className="dropdown-menu show position-absolute end-0">
                                        <div className="user-header">
                                            <small>Hoşgeldin,</small>
                                            <strong>{user?.fullName}</strong>
                                        </div>
                                        <Link className="dropdown-item" to="/profile">
                                            <i className="fas fa-user"></i> Profilim
                                        </Link>
                                        <Link className="dropdown-item" to="/my-orders">
                                            <i className="fas fa-receipt"></i> Siparişlerim
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                            <i className="fas fa-sign-out-alt"></i> Çıkış Yap
                                        </button>
                                    </div>
                                )}
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-auth" to="/login">Giriş Yap</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}