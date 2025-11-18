import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  // Veriyi 'cart' olarak alıyoruz
  const cart = useSelector((state) => state.cart);

  const [collapsed, setCollapsed] = useState(true);
  const [showMenus, setShowMenus] = useState(false);
  const [showAllergies, setShowAllergies] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Alerjen state'i
  const [allergies, setAllergies] = useState({
    nuts: false,
    gluten: false,
    dairy: false,
  });
  const [excludeIngredients, setExcludeIngredients] = useState({
    onion: false,
    garlic: false,
  });

  const cartCount = Array.isArray(cart?.items) ? cart.items.length : 0;

  const toggleCollapse = () => setCollapsed((c) => !c);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleAllergy = (key) =>
    setAllergies((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleExclude = (key) =>
    setExcludeIngredients((prev) => ({ ...prev, [key]: !prev[key] }));

  const applyFilters = () => {
    const params = {
      allergies,
      exclude: excludeIngredients,
    };
    console.log("Filtre uygula", params);
    setShowAllergies(false);
  };

  const clearFilters = () => {
    setAllergies({ nuts: false, gluten: false, dairy: false });
    setExcludeIngredients({ onion: false, garlic: false });
  };

return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/*Marka ve Toggler butonu aynı*/}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="brand-logo">R</div>
          <span>Restaurant App</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-expanded={!collapsed}
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${!collapsed ? "show" : ""}`}>
          {/* Sol linkler */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/*Anasayfa*/}
            <li className="nav-item">
              <NavLink className="nav-link" end to="/">Anasayfa</NavLink>
            </li>
            {/* Menüler Dropdown*/}
            <li className="nav-item dropdown">
              <button
                className="nav-link btn btn-link dropdown-toggle"
                onClick={() => setShowMenus((s) => !s)}
              >
                Menüler
              </button>
              <ul
                className={`dropdown-menu ${showMenus ? "show-manual" : ""}`}
                onMouseLeave={() => setShowMenus(false)}
              >
                {/*menü linkleri*/}
              </ul>
            </li>
            {/* Rezervasyonlar*/}
            <li className="nav-item">
              <NavLink className="nav-link" to="/reservations">Rezervasyonlar</NavLink>
            </li>
          </ul>

          {/* ... (Orta Arama Formu ve Alerjenler Dropdown'ı aynı) ... */}

          {/* Sağ Aksiyonlar */}
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Alerjen ve sepet linkleri */}

            {/* Kullanıcı / Auth */}
            {isAuthenticated ? (
              // Hesabım
              <li className="nav-item dropdown">
                <button
                  className="btn btn-link nav-link dropdown-toggle text-white d-flex align-items-center"
                  // 'onClick' eklendi
                  onClick={() => setShowUserMenu((s) => !s)} 
                >
                  <img
                    src={user?.avatar || "/placeholder-avatar.png"}
                    alt="avatar"
                    className="user-avatar"
                  />
                  <span className="d-none d-sm-inline">{user?.email || "Kullanıcı"}</span>
                </button>
                {/* 'show-manual' class'ı ve 'onMouseLeave' */}
                <ul 
                  className={`dropdown-menu dropdown-menu-end ${showUserMenu ? "show-manual" : ""}`}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">Profilim</Link>
                  </li>
                  {user?.role === "Admin" && (
                    <li>
                      <Link className="dropdown-item" to="/admin">Admin Panel</Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Çıkış Yap
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              // Giriş yapmamış
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/login">
                    Giriş Yap
                  </NavLink>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light ms-2" to="/signup">
                    Kayıt Ol
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}