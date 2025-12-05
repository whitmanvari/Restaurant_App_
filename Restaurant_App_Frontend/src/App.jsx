import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Ana Sayfalar (Klasik yollar)
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UserProfilePage from './pages/UserProfilePage';
import ReservationPage from './pages/ReservationPage';
import ProductDetailPage from './pages/ProductDetailPage';

// --- ADMIN SAYFALARI 
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminReservationPage from './pages/admin/AdminReservationPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminTableConfigPage from './pages/admin/AdminTableConfigPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCommentsPage from './pages/admin/AdminCommentsPage';

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

function App() {
  return (
    <div>
      <NotificationManager />
      <Routes>
        {/* User Routes */}
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

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="reservations" element={<AdminReservationPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />

          {/* Yönetim */}
          <Route path="menu" element={<AdminMenuPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="comments" element={<AdminCommentsPage />} />
          <Route path="table-config" element={<AdminTableConfigPage />} />
          <Route path="users" element={<AdminUsersPage />} />

          <Route path="tables" element={<AdminDashboard />} />
          <Route path="settings" element={<Navigate to="/profile" replace />} />
        </Route>

        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </div>
  );
}

export default App;