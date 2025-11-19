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

function App() {
 return (
    <div>
      <NotificationManager/>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<HomePage />} /> 
          
          <Route path="login" element={<AuthPage />} />
          <Route path="signup" element={<AuthPage />} />
          
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="admin/menu" element={<AdminMenuPage />} />
          <Route path="admin/orders" element={<AdminOrdersPage />} />
          <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
          
          <Route path="menu" element={<MenuPage />} /> 
          <Route path="menu/:category" element={<MenuPage />} />
          <Route path="admin/settings" element={<AdminSettingsPage />} />

          <Route path="reservations" element={<HomePage />} />
          <Route path="cart" element={<HomePage />} />
          <Route path="my-orders" element={<HomePage />} />
          <Route path="profile" element={<HomePage />} />
          <Route path="admin" element={<HomePage />} />

          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App
