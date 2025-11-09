import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {logout } from '../store/slices/authSlice';

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isAuthenticated} = useSelector((state) => state.auth);
    const handleLogout = () => {
        dispatch(logout()); //redux state'ini ve loal storage'ı temizle
        navigate('/login'); //login sayfasına yönlendir
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                Restaurant App
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Anasayfa</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        {isAuthenticated ? (
                            <>
                            <li className="nav-item">
                                <span className="nav-link text-light">Hoş geldin!</span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>Çıkış Yap</button>
                            </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                Giriş Yap
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;