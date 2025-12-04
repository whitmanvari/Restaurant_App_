import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from '../AdminSidebar'; 
import '../../styles/admin-layout.scss'; 

export default function AdminLayout() {
    const { user, isAuthenticated } = useSelector(state => state.auth);

    // Güvenlik: Admin değilse anasayfaya at
    if (!isAuthenticated || user?.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="admin-layout">
            {/* SOL TARAFTA SABİT MENÜ */}
            <AdminSidebar />
            
            {/* SAĞ TARAFTA DEĞİŞEN İÇERİK */}
            <div className="admin-content">
                {/* Outlet, App.jsx'teki child route'ları buraya render eder */}
                <Outlet />
            </div>
        </div>
    );
}