import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { categoryService } from '../../services/categoryService';
import { toast } from 'react-toastify';

const AdminAnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        topSelling: [],
        categoryData: [],
        revenueTrend: []
    });

    const COLORS = ['#C5A059', '#D4B77E', '#8B7355', '#2C2C2C', '#A0A0A0', '#E5E5E5'];

    useEffect(() => {
        fetchRealData();
    }, []);

    const fetchRealData = async () => {
        try {
            const [products, categories, onlineOrders, tableOrders] = await Promise.all([
                productService.getAll(),
                categoryService.getAll(),
                orderService.getAllOnlineOrders(),
                orderService.getAllTableOrders()
            ]);

            // Sadece iptal edilmemişleri al
            const validOnline = onlineOrders.filter(o => o.orderState !== 2);
            const validTable = tableOrders.filter(o => o.status !== 'Canceled');
            const allOrders = [...validOnline, ...validTable];

            // 1. Finansal Özet
            const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            const totalOrderCount = allOrders.length;
            const avgOrder = totalOrderCount > 0 ? totalRevenue / totalOrderCount : 0;

            // ÜRÜN SAYMA MANTIĞI
            const productSalesCount = {}; 

            // A. Online Siparişleri Say
            validOnline.forEach(order => {
                // DTO'da "Items" -> JSON'da "items"
                // Garanti olsun diye her ihtimali kontrol ediyoruz
                const itemList = order.items || order.Items || []; 
                
                itemList.forEach(item => {
                    const name = item.productName || "Bilinmiyor";
                    productSalesCount[name] = (productSalesCount[name] || 0) + item.quantity;
                });
            });

            // B. Masa Siparişleri Say
            validTable.forEach(order => {
                // DTO'da "OrderItems" -> JSON'da "orderItems"
                const itemList = order.orderItems || order.OrderItems || [];

                itemList.forEach(item => {
                    const name = item.productName || "Bilinmiyor";
                    productSalesCount[name] = (productSalesCount[name] || 0) + item.quantity;
                });
            });

            const topSellingChartData = Object.keys(productSalesCount)
                .map(key => ({ name: key, sales: productSalesCount[key] }))
                .sort((a, b) => b.sales - a.sales) // Çoktan aza sırala
                .slice(0, 5); // İlk 5'i al

            // 3. Kategori Dağılımı
            const categoryChartData = categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                return { name: cat.name, value: count };
            }).filter(c => c.value > 0);

            // 4. Gelir Trendi
            const revenueByDate = {};
            allOrders.forEach(order => {
                // Tarih formatı hatasını önlemek için try-catch veya kontrol
                try {
                    const d = new Date(order.orderDate);
                    if(!isNaN(d.getTime())) {
                        const dateStr = d.toLocaleDateString('tr-TR'); // "07.12.2025"
                        revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + order.totalAmount;
                    }
                } catch (e) {}
            });

            const revenueTrendData = Object.keys(revenueByDate).map(date => ({
                date: date.substring(0, 5), // Gün/Ay
                total: revenueByDate[date]
            }));

            setStats({
                totalRevenue,
                totalOrders: totalOrderCount,
                avgOrderValue: avgOrder,
                topSelling: topSellingChartData,
                categoryData: categoryChartData,
                revenueTrend: revenueTrendData
            });
            setLoading(false);

        } catch (error) {
            console.error("Analiz hatası:", error);
            toast.error("Analiz verileri alınamadı.");
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    const cardStyle = { backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' };

    return (
        <div className="container mt-5 pt-5 mb-5">
            <h2 className="mb-4" style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>
                Gerçek Zamanlı Analizler
            </h2>

            {/* KPI KARTLARI */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 text-white" style={{ background: 'linear-gradient(135deg, #C5A059 0%, #D4B77E 100%)' }}>
                        <h6 className="text-uppercase mb-2 opacity-75">Toplam Ciro</h6>
                        <h2 className="fw-bold mb-0">{stats.totalRevenue.toLocaleString('tr-TR')} ₺</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4" style={cardStyle}>
                        <h6 className="text-uppercase mb-2 text-muted">Toplam Sipariş</h6>
                        <h2 className="fw-bold mb-0">{stats.totalOrders} Adet</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4" style={cardStyle}>
                        <h6 className="text-uppercase mb-2 text-muted">Ortalama Sepet</h6>
                        <h2 className="fw-bold mb-0">{stats.avgOrderValue.toFixed(2)} ₺</h2>
                    </div>
                </div>
            </div>

            {/* GRAFİKLER */}
            <div className="row g-4">
                
                {/* 1. EN ÇOK SATANLAR */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm p-4 h-100" style={cardStyle}>
                        <h5 className="mb-4">En Çok Satan Ürünler</h5>
                        {stats.topSelling.length > 0 ? (
                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.topSelling} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: 'var(--text-main)'}} />
                                        <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', borderColor: 'var(--border-color)'}} />
                                        <Bar dataKey="sales" fill="#C5A059" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <i className="fas fa-chart-bar fa-2x mb-3 opacity-50"></i>
                                <p>Henüz satış verisi oluşmadı.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. KATEGORİ DAĞILIMI */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm p-4 h-100" style={cardStyle}>
                        <h5 className="mb-4">Menü Dağılımı</h5>
                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', borderColor: 'var(--border-color)'}} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. GELİR TRENDİ */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm p-4" style={cardStyle}>
                        <h5 className="mb-4">Günlük Gelir Trendi</h5>
                        {stats.revenueTrend.length > 0 ? (
                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.revenueTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" tick={{fill: 'var(--text-main)'}} />
                                        <YAxis tick={{fill: 'var(--text-main)'}} />
                                        <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', borderColor: 'var(--border-color)'}} formatter={(value) => [`${value} ₺`, 'Ciro']} />
                                        <Area type="monotone" dataKey="total" stroke="#C5A059" fill="#C5A059" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-muted text-center py-5">Henüz veri yok.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminAnalyticsPage;