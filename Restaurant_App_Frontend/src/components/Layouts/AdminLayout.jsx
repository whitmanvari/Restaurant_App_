import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from '../AdminSidebar';
import '../../styles/admin-layout.scss'; 

export default function AdminLayout() {
    const { user, isAuthenticated } = useSelector(state => state.auth);

    // --- DARK MODE MANTIĞI  ---
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    // Güvenlik: Admin değilse anasayfaya at
    if (!isAuthenticated || user?.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="admin-layout">
            {/* SOL TARAFTA SABİT MENÜ */}
            <AdminSidebar />
            
            {/* SAĞ TARAFTA DEĞİŞEN İÇERİK */}
            <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                
                <header className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style={{ backgroundColor: 'var(--bg-card)' }}>
                    <h5 className="m-0 fw-bold text-muted">Yönetim Paneli</h5>
                    
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted small d-none d-md-block">Merhaba, {user?.fullName}</span>
                        
                        {/* Dark Mode Butonu */}
                        <button 
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" 
                            style={{ width: '40px', height: '40px' }}
                            onClick={toggleTheme}
                            title={darkMode ? "Aydınlık Mod" : "Karanlık Mod"}
                        >
                            {darkMode ? <i className="fas fa-sun text-warning"></i> : <i className="fas fa-moon"></i>}
                        </button>
                    </div>
                </header>

                {/* Sayfa İçeriği (Outlet) */}
                <div className="p-4 flex-grow-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}