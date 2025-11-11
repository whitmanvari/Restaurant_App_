import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotificationManager from './components/NotificationManager';
import Layout from './components/Layout';

function App() {
  return (
    <div>
      <NotificationManager/>
      <Routes>
        <Route path="/" element={<Layout/>}>
          {/* Ana dizin (/) HomePage'i göstersin */}
          <Route path="/" element={<HomePage />} /> 

          {/* /login adresi LoginPage'i göstersin */}
          <Route path="/login" element={<LoginPage />} />

          {/* Eşleşmeyen diğer tüm yollar Ana Sayfaya gitsin */}
          <Route path="*" element={<HomePage />} /> 
         </Route>
      </Routes>
    </div>
  );
}

export default App
