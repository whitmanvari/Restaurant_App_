import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar'; // Bir üst dizindeki components klasöründen
import Footer from '../Footer'; 

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Üst Menü */}
            <Navbar />
            
            {/* Değişen İçerik Alanı (Sayfalar burada render olur) */}
            <main style={{ flex: 1 }}> 
                <Outlet />
            </main>
            
            {/* Alt Bilgi */}
            <Footer />
        </div>
    );
};

export default MainLayout;