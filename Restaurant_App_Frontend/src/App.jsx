import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
   <Routes>
      {/* Ana dizin (/) HomePage'i göstersin */}
      <Route path="/" element={<HomePage />} /> 

      {/* /login adresi LoginPage'i göstersin */}
      <Route path="/login" element={<LoginPage />} />

      {/* Eşleşmeyen diğer tüm yollar Ana Sayfaya gitsin */}
      <Route path="*" element={<HomePage />} /> 
    </Routes>
  );
}

export default App
