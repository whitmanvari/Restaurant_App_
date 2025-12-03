import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import NotificationManager from './components/NotificationManager';
import Layout from './components/Layout';
import MenuPage from './pages/MenuPage';
import AdminDashboard from './pages/AdminDashboard';
import UserProfilePage from './pages/UserProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import ReservationPage from './pages/ReservationPage';
import AdminReservationPage from './pages/AdminReservationPage'; 
import ProductDetailPage from './pages/ProductDetailPage'; 
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminTableConfigPage from './pages/AdminTableConfigPage';
import AdminUsersPage from './pages/AdminUsersPage'; 
import OrderSuccessModal from './components/StatusPages/OrderSuccessModal';

// STATUS PAGES
import SuccessPage from './components/StatusPages/SuccessPage';
import ErrorPage from './components/StatusPages/ErrorPage';
import NotFoundPage from './components/StatusPages/NotFoundPage';

function App() {
    const { user } = useSelector(state => state.auth); 

    const AdminRoute = ({ element: Element }) => {
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
                    
                    {/* Kullanıcı İşlemleri */}
                    <Route path="menu" element={<MenuPage />} />
                    <Route path="menu/:category" element={<MenuPage />} />
                    <Route path="product/:id" element={<ProductDetailPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="profile" element={<UserProfilePage />} />
                    <Route path="my-orders" element={<UserProfilePage />} />
                    <Route path="reservations" element={<ReservationPage />} />
                    <Route path="checkout" element={<CheckoutPage />} /> 

                    {/* Admin Sayfaları */}
                    <Route path="admin" element={<AdminRoute element={<AdminDashboard />} />} />
                    <Route path="admin/menu" element={<AdminRoute element={<AdminMenuPage />} />} />
                    <Route path="admin/orders" element={<AdminRoute element={<AdminOrdersPage />} />} />
                    <Route path="admin/analytics" element={<AdminRoute element={<AdminAnalyticsPage />} />} />
                    <Route path="admin/users" element={<AdminRoute element={<AdminUsersPage />} />} />
                    <Route path="admin/reservations" element={<AdminRoute element={<AdminReservationPage />} />} />
                    <Route path="admin/categories" element={<AdminRoute element={<AdminCategoriesPage />} />} />
                    <Route path="admin/table-config" element={<AdminRoute element={<AdminTableConfigPage />} />} />
                    <Route path="admin/settings" element={<Navigate to="/profile" replace />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<HomePage />} />
                </Route>

                {/* Status Pages (Layout Dışı) */}
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="/success" element={<OrderSuccessModal show={true} onClose={() => {}} />} /> {/* Eğer direkt erişim istenirse */}
            </Routes>
        </div>
    );
}

export default App;