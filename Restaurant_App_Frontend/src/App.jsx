import { Routes, Route, Navigate } from 'react-router-dom'; // Navigate import edildi
import { useSelector } from 'react-redux'; // useSelector import edildi
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import NotificationManager from './components/NotificationManager';
import Layout from './components/Layout';
import MenuPage from './pages/MenuPage';
import AdminDashboard from './pages/AdminDashboard';
import UserProfilePage from './pages/UserProfilePage';
import CartPage from './pages/CartPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import ReservationPage from './pages/ReservationPage';
import AdminReservationPage from './pages/AdminReservationPage'; 

function App() {
    // Admin yetkisi kontrolü için Redux'tan user çekilir
    const { user } = useSelector(state => state.auth); 

    // Admin Route Koruyucusu (Helper Component)
    const AdminRoute = ({ element: Element }) => {
        // user null veya Admin rolünde değilse anasayfaya yönlendir
        if (!user || user.role !== 'Admin') {
            return <Navigate to="/" replace />;
        }
        return Element;
    };

    return (
        <div>
            <NotificationManager />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />

                    <Route path="login" element={<AuthPage />} />
                    <Route path="signup" element={<AuthPage />} />

                    {/* Kullanıcı Sayfaları */}
                    <Route path="menu" element={<MenuPage />} />
                    <Route path="menu/:category" element={<MenuPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="profile" element={<UserProfilePage />} />
                    <Route path="my-orders" element={<UserProfilePage />} />
                    <Route path="reservations" element={<ReservationPage />} />

                    {/* Admin Sayfaları */}
                    <Route path="admin" element={<AdminRoute element={<AdminDashboard />} />} />
                    <Route path="admin/menu" element={<AdminRoute element={<AdminMenuPage />} />} />
                    <Route path="admin/orders" element={<AdminRoute element={<AdminOrdersPage />} />} />
                    <Route path="admin/analytics" element={<AdminRoute element={<AdminAnalyticsPage />} />} />
                    <Route path="admin/settings" element={<AdminRoute element={<AdminSettingsPage />} />} />
                    
                    {/* YENİ REZERVASYON YÖNETİMİ SAYFASI */}
                    <Route path="admin/reservations" element={<AdminRoute element={<AdminReservationPage />} />} />

                    {/* 404 - Hatalı URL girilirse ana sayfaya at */}
                    <Route path="*" element={<HomePage />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;