import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
// Stiller 'main.scss' üzerinden geliyor.

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // state.auth.user objesini (role ve email ile) bekliyoruz
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  // state.cart.items dizisini bekliyoruz
  const cart = useSelector((state) => state.cart);

  const [collapsed, setCollapsed] = useState(true);
  const [showMenus, setShowMenus] = useState(false);
  const [showAllergies, setShowAllergies] = useState(false);

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

  const cartCount = Array.isArray(cart.items) ? cart.items.length : 0;

  const toggleCollapse = () => setCollapsed((c) => !c);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleAllergy = (key) =>
    setAllergies((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleExclude = (key) =>
    setExcludeIngredients((prev) => ({ ...prev, [key]: !prev[key] }));

  // Alerjen filtresini uygula (şimdilik konsola yazıyor)
  const applyFilters = () => {
    const params = {
      allergies,
      exclude: excludeIngredients,
    };
    console.log("Filtre uygula", params);
    // TODO: navigate(`/menu?filter...`)
    setShowAllergies(false); // Dropdown'u kapat
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setAllergies({ nuts: false, gluten: false, dairy: false });
    setExcludeIngredients({ onion: false, garlic: false });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Global SASS class'ı */}
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
            <li className="nav-item">
              <NavLink className="nav-link" end to="/">
                Anasayfa
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <button
                className="nav-link btn btn-link dropdown-toggle"
                onClick={() => setShowMenus((s) => !s)}
              >
                Menüler
              </button>
              <ul
                className={`dropdown-menu ${showMenus ? "show-manual" : ""}`}
                onMouseLeave={() => setShowMenus(false)} // Mouse ayrılınca kapat
              >
                <li>
                  <NavLink className="dropdown-item" to="/menu/pizza">Pizza</NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/menu/pasta">Pasta</NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/menu/salad">Salatalar</NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <NavLink className="dropdown-item" to="/menu">
                    Tüm Menüyü Gör
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/reservations">
                Rezervasyonlar
              </NavLink>
            </li>
          </ul>

          {/* Orta Arama Formu */}
          <form className="d-none d-lg-flex mx-3" role="search" onSubmit={(e)=>e.preventDefault()}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search" />
              </span>
              <input
                className="form-control border-start-0"
                type="search"
                placeholder="Lezzetli bir şey ara..."
                aria-label="Search"
              />
            </div>
          </form>

          {/* Sağ Aksiyonlar */}
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Alerjen Filtresi */}
            <li className="nav-item dropdown me-2">
              <button
                className="btn btn-outline-light btn-sm dropdown-toggle"
                onClick={() => setShowAllergies((s) => !s)}
              >
                Alerjenler
              </button>
              <div 
                className={`dropdown-menu dropdown-menu-end p-3 ${showAllergies ? "show-manual" : ""}`} 
                style={{ minWidth: 220 }}
                onMouseLeave={() => setShowAllergies(false)}
              >
                <div className="mb-2">
                  <strong className="d-block">Alerjenler</strong>
                  {/* Alerjen Checkbox'ları */}
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="al-nuts" checked={allergies.nuts} onChange={() => toggleAllergy("nuts")} />
                    <label className="form-check-label" htmlFor="al-nuts">Fındık / Kuruyemiş</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="al-gluten" checked={allergies.gluten} onChange={() => toggleAllergy("gluten")} />
                    <label className="form-check-label" htmlFor="al-gluten">Gluten</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="al-dairy" checked={allergies.dairy} onChange={() => toggleAllergy("dairy")} />
                    <label className="form-check-label" htmlFor="al-dairy">Süt Ürünleri</label>
                  </div>
                </div>

                <div className="mb-2">
                  <strong className="d-block">Hariç Tut (Ters Filtre)</strong>
                  {/* Hariç Tut Checkbox'ları */}
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="ex-onion" checked={excludeIngredients.onion} onChange={() => toggleExclude("onion")} />
                    <label className="form-check-label" htmlFor="ex-onion">Soğan</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="ex-garlic" checked={excludeIngredients.garlic} onChange={() => toggleExclude("garlic")} />
                    <label className="form-check-label" htmlFor="ex-garlic">Sarımsak</label>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-sm btn-secondary" onClick={clearFilters}>
                    Temizle
                  </button>
                  <button type="button" className="btn btn-sm btn-primary" onClick={applyFilters}>
                    Uygula
                  </button>
                </div>
              </div>
            </li>

            {/* Sepet */}
            <li className="nav-item me-2">
              <NavLink to="/cart" className="btn btn-outline-light position-relative">
                <i className="bi bi-basket"></i>
                <span className="ms-2 d-none d-sm-inline">Sepet</span>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>

            {/* Rezervasyon Butonu */}
            <li className="nav-item me-3">
              <Link to="/reservations/new" className="btn btn-light text-dark">
                Rezervasyon Yap
              </Link>
            </li>

            {/* Kullanıcı / Auth */}
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-link nav-link dropdown-toggle text-white d-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  {/* Global SASS class'ı */}
                  <img
                    src={user?.avatar || "/placeholder-avatar.png"}
                    alt="avatar"
                    className="user-avatar"
                  />
                  <span className="d-none d-sm-inline">{user?.email || "Kullanıcı"}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">Profilim</Link>
                  </li>
                  {/* Admin Panel Linki (Role göre) */}
                  {user?.role === "Admin" && (
                    <li>
                      <Link className="dropdown-item" to="/admin">
                        Admin Panel
                      </Link>
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