import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotificationManager from './components/NotificationManager';
import Layout from './components/Layout';
import MenuPage from './pages/MenuPage';
// import RegisterPage from './pages.RegisterPage';

function App() {
  return (
    <div>
      <NotificationManager/>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<HomePage />} /> 
          <Route path="login" element={<LoginPage />} />
          
          <Route path="menu" element={<MenuPage />} /> 
          <Route path="menu/:category" element={<MenuPage />} /> {/* Kategori filtresi için bu kalsın */}

          <Route path="signup" element={<HomePage />} /> {/* TODO: RegisterPage */}
          <Route path="reservations" element={<HomePage />} /> {/* TODO: ReservationPage */}
          <Route path="reservations/new" element={<HomePage />} />
          <Route path="cart" element={<HomePage />} /> {/* TODO: CartPage */}
          <Route path="my-orders" element={<HomePage />} /> {/* TODO: OrdersPage */}
          <Route path="profile" element={<HomePage />} /> {/* TODO: ProfilePage */}
          <Route path="admin" element={<HomePage />} /> {/* TODO: AdminPage */}

          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App
