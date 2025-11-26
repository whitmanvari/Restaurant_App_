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
import AdminMenuPage from './pages/AdminMenuPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import ReservationPage from './pages/ReservationPage';
import AdminReservationPage from './pages/AdminReservationPage'; 
import ProductDetailPage from './pages/ProductDetailPage'; 

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

                    {/* Kullanıcı Sayfaları */}
                    <Route path="menu" element={<MenuPage />} />
                    <Route path="menu/:category" element={<MenuPage />} />
                    
                    {/* ÜRÜN DETAY --- */}
                    {/* :id kısmı değişkendir (product/5, product/10 vb.) */}
                    <Route path="product/:id" element={<ProductDetailPage />} />

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
                    <Route path="admin/reservations" element={<AdminRoute element={<AdminReservationPage />} />} />
                    <Route path="admin/tables" element={<AdminRoute element={<AdminDashboard />} />} /> {/* Dashboard'a yönlendirir */}

                    {/* 404 - Hatalı URL girilirse ana sayfaya at */}
                    <Route path="*" element={<HomePage />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;