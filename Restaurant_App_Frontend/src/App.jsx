import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
 return (
    <div>
      <NotificationManager/>
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
          <Route path="my-orders" element={<UserProfilePage />} /> {/* Siparişlerim profilin içinde */}
          <Route path="reservations" element={<ReservationPage />} /> {/* ReservationPage tanımlı olmalı */}

          {/* Admin Sayfaları */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/menu" element={<AdminMenuPage />} />
          <Route path="admin/orders" element={<AdminOrdersPage />} />
          <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="admin/settings" element={<AdminSettingsPage />} />

          {/* 404 - Hatalı URL girilirse ana sayfaya at */}
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App