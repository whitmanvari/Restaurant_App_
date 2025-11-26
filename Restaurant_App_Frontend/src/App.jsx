import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import AdminTableManagementPage from './pages/AdminTableManagementPage';

const AdminRoute = () => {
  const { user } = useSelector(state => state.auth);
  if (!user || user.role !== 'Admin') return <Navigate to="/" replace />;
  return <Outlet />;
};

function App() {
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
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/menu" element={<AdminMenuPage />} />
            <Route path="admin/orders" element={<AdminOrdersPage />} />
            <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
            {/* MASA YÖNETİMİ */}
            <Route path="admin/tables" element={<AdminRoute element={<AdminTableManagementPage />} />} />
            
            {/* AYARLAR (Kategori/Masa Ekleme) */}
            <Route path="admin/settings" element={<AdminRoute element={<AdminSettingsPage />} />} />
            <Route path="admin/reservations" element={<AdminReservationPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
