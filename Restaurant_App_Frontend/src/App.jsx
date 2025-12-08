import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Ana Sayfalar
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UserProfilePage from './pages/UserProfilePage';
import ReservationPage from './pages/ReservationPage';
import ProductDetailPage from './pages/ProductDetailPage';

// --- ADMIN SAYFALARI ---
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminReservationPage from './pages/admin/AdminReservationPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCommentsPage from './pages/admin/AdminCommentsPage';
// YENİ: Tek Merkezli Masa Yönetimi
import AdminTablesPage from './pages/admin/AdminTablesPage'; 

// Layouts
import MainLayout from './components/Layouts/MainLayout';
import AdminLayout from './components/Layouts/AdminLayout';
import NotificationManager from './components/NotificationManager';

// Status Pages
import SuccessPage from './components/StatusPages/SuccessPage';
import ErrorPage from './components/StatusPages/ErrorPage';
import NotFoundPage from './components/StatusPages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';

function App() {
  return (
    <div>
      <NotificationManager />
      <Routes>
        {/* --- USER ROUTES --- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<AuthPage />} />
          <Route path="signup" element={<AuthPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="menu/:category" element={<MenuPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="my-orders" element={<UserProfilePage />} />
          <Route path="reservations" element={<ReservationPage />} />
        </Route>

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<AdminLayout />}>
            {/* 1. Admin anasayfası (/admin) girilince direkt Masalar sayfasına yönlendir */}
            <Route index element={<Navigate to="tables" replace />} />
            
            {/* 2. Masa Yönetimi*/}
            <Route path="tables" element={<AdminTablesPage />} />

            {/* Diğer Admin Sayfaları */}
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="reservations" element={<AdminReservationPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="comments" element={<AdminCommentsPage />} />
            
            {/* Ayarlar (User Profile'ın Admin Görünümü) */}
            <Route path="settings" element={<UserProfilePage isAdminView={true} />} />
        </Route>

        {/* --- STATUS ROUTES --- */}
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/confirm-email" element={<EmailConfirmationPage />} />
        
        {/* --- 404 NOT FOUND  --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;