import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { categoryService } from '../../services/categoryService';
import { toast } from 'react-toastify';

const AdminAnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    
    // Gerçek Verilerle Dolacak State
    const [stats, setStats] = useState({
        totalRevenue: 0,     // Toplam Ciro
        totalOrders: 0,      // Toplam Sipariş Sayısı
        avgOrderValue: 0,    // Ortalama Sepet Tutarı
        topSelling: [],      // En Çok Satan Ürünler (Grafik için)
        categoryData: [],    // Kategori Dağılımı (Grafik için)
        revenueTrend: []     // Günlük Ciro Grafiği
    });

    // Renk Paleti
    const COLORS = ['#C5A059', '#D4B77E', '#8B7355', '#2C2C2C', '#A0A0A0', '#E5E5E5'];

    useEffect(() => {
        fetchRealData();
    }, []);

    const fetchRealData = async () => {
        try {
            // 1. API'den Tüm Verileri Çek
            const [products, categories, onlineOrders, tableOrders] = await Promise.all([
                productService.getAll(),
                categoryService.getAll(),
                orderService.getAllOnlineOrders(),
                orderService.getAllTableOrders()
            ]);

            // 2. Siparişleri Birleştir (Sadece İptal Edilmemişleri Al)
            // Online: OrderState != 2 (Canceled)
            // Table: Status != 'Canceled'
            const validOnline = onlineOrders.filter(o => o.orderState !== 2);
            const validTable = tableOrders.filter(o => o.status !== 'Canceled');
            
            const allOrders = [...validOnline, ...validTable];

            // --- ANALİZ 1: FİNANSAL ÖZET ---
            const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            const totalOrderCount = allOrders.length;
            const avgOrder = totalOrderCount > 0 ? totalRevenue / totalOrderCount : 0;

            // --- ANALİZ 2: EN ÇOK SATAN ÜRÜNLER ---
            // Tüm siparişlerin içindeki 'items' veya 'orderItemsInRestaurant' listelerini tarayacağız
            const productSalesCount = {}; // { "Kuzu Tandır": 5, "Kola": 10 }

            // Online Siparişleri Say
            validOnline.forEach(order => {
                order.items?.forEach(item => {
                    const name = item.productName || "Bilinmiyor";
                    productSalesCount[name] = (productSalesCount[name] || 0) + item.quantity;
                });
            });

            // Masa Siparişlerini Say
            validTable.forEach(order => {
                order.orderItemsInRestaurant?.forEach(item => {
                    const name = item.productName || "Bilinmiyor";
                    productSalesCount[name] = (productSalesCount[name] || 0) + item.quantity;
                });
            });

            // Grafik formatına çevir ve sırala (Top 5)
            const topSellingChartData = Object.keys(productSalesCount)
                .map(key => ({ name: key, sales: productSalesCount[key] }))
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5);

            // --- ANALİZ 3: KATEGORİ DAĞILIMI ---
            const categoryChartData = categories.map(cat => {
                // Bu kategoriye ait kaç ürün var?
                const count = products.filter(p => p.categoryId === cat.id).length;
                return { name: cat.name, value: count };
            }).filter(c => c.value > 0);

            // --- ANALİZ 4: GELİR TRENDİ (Son 7 Gün) ---
            // Siparişleri tarihe göre grupla
            const revenueByDate = {};
            allOrders.forEach(order => {
                const date = new Date(order.orderDate).toLocaleDateString('tr-TR'); // "25.11.2025"
                revenueByDate[date] = (revenueByDate[date] || 0) + order.totalAmount;
            });

            // Obje -> Array dönüşümü
            const revenueTrendData = Object.keys(revenueByDate).map(date => ({
                date: date.substring(0, 5), // Sadece Gün/Ay göster
                total: revenueByDate[date]
            }));

            // State'i Güncelle
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

    return (
        <div className="container mt-5 pt-5 mb-5">
            <h2 className="mb-4" style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>
                Gerçek Zamanlı Analizler
            </h2>

            {/* KPI KARTLARI */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 text-white" style={{ background: 'linear-gradient(135deg, #C5A059 0%, #D4B77E 100%)' }}>
                        <h6 className="text-uppercase mb-2" style={{ opacity: 0.9 }}>Toplam Ciro</h6>
                        <h2 className="fw-bold mb-0">{stats.totalRevenue.toLocaleString('tr-TR')} ₺</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 bg-dark text-white">
                        <h6 className="text-uppercase mb-2" style={{ opacity: 0.7 }}>Toplam Sipariş</h6>
                        <h2 className="fw-bold mb-0">{stats.totalOrders} Adet</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 bg-white">
                        <h6 className="text-uppercase mb-2 text-muted">Ortalama Sepet</h6>
                        <h2 className="fw-bold mb-0 text-dark">{stats.avgOrderValue.toFixed(2)} ₺</h2>
                    </div>
                </div>
            </div>

            {/* GRAFİKLER */}
            <div className="row g-4">
                
                {/* 1. EN ÇOK SATANLAR (Bar Chart) */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h5 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>En Çok Satan Ürünler</h5>
                        {stats.topSelling.length > 0 ? (
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={stats.topSelling} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                                        <Tooltip formatter={(value) => [`${value} Adet`, 'Satış']} />
                                        <Bar dataKey="sales" fill="#C5A059" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-muted text-center py-5">Henüz yeterli satış verisi yok.</p>
                        )}
                    </div>
                </div>

                {/* 2. KATEGORİ DAĞILIMI (Pie Chart) */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h5 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Menü Dağılımı</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
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
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. GELİR TRENDİ (Area Chart) */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm p-4">
                        <h5 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Günlük Gelir Trendi</h5>
                        {stats.revenueTrend.length > 0 ? (
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={stats.revenueTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${value} ₺`, 'Ciro']} />
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