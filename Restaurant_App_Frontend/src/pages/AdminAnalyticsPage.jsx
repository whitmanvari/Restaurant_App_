import React, { useEffect, useState } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { categoryService } from '../services/categoryService';
import { toast } from 'react-toastify';

function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    
    // Data States
    const [popularProducts, setPopularProducts] = useState([]);
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    
    // Financial States
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [avgOrderValue, setAvgOrderValue] = useState(0);

    // Grafik Renkleri
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Paralel İstekler (Performans için)
            const [popular, topRated, categories, onlineOrders, tableOrders] = await Promise.all([
                productService.getMostPopular(5),   // En popüler 5 ürün
                productService.getTopRated(5),      // En iyi 5 ürün
                categoryService.getAll(),           // Kategoriler (Sayılarını bulmak için)
                orderService.getAllOnlineOrders(),  // Ciro hesabı için
                orderService.getAllTableOrders()    // Ciro hesabı için
            ]);

            // 2. Finansal Hesaplamalar
            const validOnlineOrders = onlineOrders.filter(o => o.orderState !== 2); // İptal olmayanlar
            const validTableOrders = tableOrders.filter(o => o.status === 'Completed'); // Ödenmiş olanlar

            const revenueOnline = validOnlineOrders.reduce((sum, o) => sum + o.totalAmount, 0);
            const revenueTable = validTableOrders.reduce((sum, o) => sum + o.totalAmount, 0);
            const totalRev = revenueOnline + revenueTable;
            const totalOrd = validOnlineOrders.length + validTableOrders.length;

            setTotalRevenue(totalRev);
            setTotalOrders(totalOrd);
            setAvgOrderValue(totalOrd > 0 ? (totalRev / totalOrd).toFixed(2) : 0);

            // 3. Kategori Bazlı Ürün Sayısı (Backend API'sini döngüye sokarak kullanıyoruz)
            const catStatsPromises = categories.map(async (cat) => {
                const count = await productService.getCategoryCount(cat.name);
                return { name: cat.name, value: count };
            });
            
            const catStatsResult = await Promise.all(catStatsPromises);
            setCategoryStats(catStatsResult);

            setPopularProducts(popular);
            setTopRatedProducts(topRated);
            setLoading(false);

        } catch (error) {
            console.error(error);
            toast.error("Analiz verileri yüklenemedi.");
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <h2 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Restoran Analitiği</h2>

            {/* --- KPI KARTLARI --- */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-dark text-white h-100">
                        <div className="card-body text-center">
                            <h6 className="text-warning text-uppercase ls-1">Toplam Ciro</h6>
                            <h3 className="display-6 fw-bold">{totalRevenue.toLocaleString('tr-TR')} ₺</h3>
                            <small className="opacity-50">Tüm Zamanlar</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <h6 className="text-muted text-uppercase ls-1">Toplam Sipariş</h6>
                            <h3 className="display-6 fw-bold">{totalOrders}</h3>
                            <small className="text-muted">Adet</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <h6 className="text-muted text-uppercase ls-1">Ort. Sepet Tutarı</h6>
                            <h3 className="display-6 fw-bold text-success">{avgOrderValue} ₺</h3>
                            <small className="text-muted">Sipariş Başına</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- GRAFİKLER --- */}
            <div className="row mb-5">
                {/* KATEGORİ DAĞILIMI (Pasta Grafik) */}
                <div className="col-lg-6 mb-4">
                    <div className="card border-0 shadow-sm p-3 h-100">
                        <h5 className="card-title mb-4">Menü Dağılımı</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={categoryStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* EN POPÜLER ÜRÜNLER (Bar Grafik) */}
                <div className="col-lg-6 mb-4">
                    <div className="card border-0 shadow-sm p-3 h-100">
                        <h5 className="card-title mb-4">En Popüler 5 Ürün (Puan & Etkileşim)</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={popularProducts} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="price" name="Fiyat (₺)" fill="#C5A059" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- LİSTELER --- */}
            <div className="row">
                {/* EN YÜKSEK PUANLI ÜRÜNLER */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Müşteri Favorileri (En Yüksek Puanlılar)</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Ürün</th>
                                        <th>Kategori</th>
                                        <th>Ortalama Puan</th>
                                        <th>Toplam Değerlendirme</th>
                                        <th className="text-end">Fiyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topRatedProducts.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={p.imageUrls?.[0]} alt="" style={{width:40, height:40, objectFit:'cover', borderRadius:4}} className="me-2"/>
                                                    <span className="fw-bold">{p.name}</span>
                                                </div>
                                            </td>
                                            <td>{p.categoryName}</td>
                                            <td>
                                                <span className="badge bg-warning text-dark">
                                                    <i className="fas fa-star me-1"></i>{p.averageRating.toFixed(1)}
                                                </span>
                                            </td>
                                            <td>{p.totalRatings} yorum</td>
                                            <td className="text-end fw-bold">{p.price} ₺</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAnalyticsPage;