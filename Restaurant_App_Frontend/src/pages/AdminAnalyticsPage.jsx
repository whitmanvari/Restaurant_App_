import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { categoryService } from '../services/categoryService';
import { tableService } from '../services/tableService';
import { toast } from 'react-toastify';

const AdminAnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month'

    // Data States
    const [dashboardData, setDashboardData] = useState({
        financial: {
            totalRevenue: 0,
            totalOrders: 0,
            avgOrderValue: 0,
            revenueGrowth: 0
        },
        charts: {
            categoryDistribution: [],
            revenueTrend: [],
            popularProducts: [],
            tablePerformance: []
        },
        insights: {
            topProducts: [],
            busyHours: [],
            customerMetrics: {}
        }
    });

    // Premium Color Palette - Adachi Style
    const CHART_COLORS = {
        primary: '#C5A059',
        secondary: '#8B7355',
        accent: '#D4B77E',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        grayscale: ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB']
    };

    useEffect(() => {
        fetchDashboardData();
    }, [timeRange]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Parallel API calls for performance
            const [products, categories, onlineOrders, tableOrders, tables] = await Promise.all([
                productService.getAll(),
                categoryService.getAll(),
                orderService.getAllOnlineOrders(),
                orderService.getAllTableOrders(),
                tableService.getAll()
            ]);

            // Process financial data
            const validOnlineOrders = onlineOrders.filter(o => o.orderState !== 2);
            const validTableOrders = tableOrders.filter(o => o.status === 'Completed');

            const revenueOnline = validOnlineOrders.reduce((sum, o) => sum + o.totalAmount, 0);
            const revenueTable = validTableOrders.reduce((sum, o) => sum + o.totalAmount, 0);
            const totalRevenue = revenueOnline + revenueTable;
            const totalOrders = validOnlineOrders.length + validTableOrders.length;
            const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

            // Process category distribution
            const categoryStats = await Promise.all(
                categories.map(async (cat) => {
                    const count = await productService.getCategoryCount(cat.name);
                    return {
                        name: cat.name,
                        value: count || 0,
                        revenue: products
                            .filter(p => p.categoryId === cat.id)
                            .reduce((sum, p) => sum + p.price, 0)
                    };
                })
            );

            // Process popular products
            const popularProducts = await productService.getMostPopular(6);
            const formattedPopular = popularProducts.map((product, index) => ({
                name: product.name.length > 12 ? product.name.substring(0, 12) + '...' : product.name,
                sales: Math.round(product.price * (product.averageRating || 1) / 10),
                revenue: product.price,
                rating: product.averageRating || 0,
                fill: Object.values(CHART_COLORS)[index % 6]
            }));

            // Process revenue trend (mock data for demo)
            const revenueTrend = generateRevenueTrend(timeRange);

            // Process table performance
            const tablePerformance = tables.map(table => ({
                name: `Masa ${table.tableNumber}`,
                occupancy: Math.random() * 100, // Mock data
                revenue: Math.random() * 5000,
                orders: Math.floor(Math.random() * 50)
            }));

            setDashboardData({
                financial: {
                    totalRevenue,
                    totalOrders,
                    avgOrderValue,
                    revenueGrowth: 12.5 // Mock growth
                },
                charts: {
                    categoryDistribution: categoryStats.filter(cat => cat.value > 0),
                    revenueTrend,
                    popularProducts: formattedPopular,
                    tablePerformance: tablePerformance.slice(0, 8)
                },
                insights: {
                    topProducts: popularProducts.slice(0, 3),
                    busyHours: generateBusyHours(),
                    customerMetrics: {
                        returningCustomers: 45,
                        newCustomers: 23,
                        satisfactionRate: 4.7
                    }
                }
            });

            setLoading(false);
        } catch (error) {
            console.error('Dashboard error:', error);
            toast.error('Veriler yüklenirken hata oluştu');
            setLoading(false);
        }
    };

    // Mock data generators
    const generateRevenueTrend = (range) => {
        const data = [];
        const points = range === 'day' ? 24 : range === 'week' ? 7 : 30;

        for (let i = 0; i < points; i++) {
            data.push({
                name: range === 'day' ? `${i}:00` : range === 'week' ? `Gün ${i + 1}` : `${i + 1} Eki`,
                revenue: Math.random() * 10000 + 5000,
                orders: Math.floor(Math.random() * 50) + 10
            });
        }
        return data;
    };

    const generateBusyHours = () => {
        return Array.from({ length: 24 }, (_, i) => ({
            hour: `${i}:00`,
            activity: Math.random() * 100
        }));
    };

    // Custom Chart Components
    const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
        return (
            <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6} fontSize="12">
                {value}
            </text>
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="text-center">
                    <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="text-muted">Dashboard yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-analytics-page bg-light min-vh-100">
            {/* Header */}
            <div className="container-fluid py-4">
                <div className="row align-items-center mb-4">
                    <div className="col">
                        <h1 className="h2 mb-1" style={{ fontFamily: 'Playfair Display', fontWeight: '600' }}>
                            Restoran Analitikleri
                        </h1>
                        <p className="text-muted mb-0">Gerçek zamanlı performans metrikleri ve içgörüler</p>
                    </div>
                    <div className="col-auto">
                        <div className="btn-group">
                            {['day', 'week', 'month'].map((range) => (
                                <button
                                    key={range}
                                    className={`btn btn-sm ${timeRange === range ? 'btn-warning' : 'btn-outline-warning'}`}
                                    onClick={() => setTimeRange(range)}
                                >
                                    {range === 'day' ? 'Günlük' : range === 'week' ? 'Haftalık' : 'Aylık'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="row g-3 mb-5">
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 bg-gradient-primary text-white">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="card-title text-warning mb-2">TOPLAM CİRO</h6>
                                        <h2 className="mb-0">{dashboardData.financial.totalRevenue.toLocaleString('tr-TR')} ₺</h2>
                                        <small className="opacity-75">
                                            ↗ %{dashboardData.financial.revenueGrowth} artış
                                        </small>
                                    </div>
                                    <div className="bg-warning rounded p-2">
                                        <i className="fas fa-chart-line fa-lg text-dark"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="card-title text-muted mb-2">TOPLAM SİPARİŞ</h6>
                                        <h2 className="mb-0">{dashboardData.financial.totalOrders}</h2>
                                        <small className="text-muted">Bu {timeRange} içinde</small>
                                    </div>
                                    <div className="bg-light rounded p-2">
                                        <i className="fas fa-shopping-bag fa-lg text-warning"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="card-title text-muted mb-2">ORT. SEPET TUTARI</h6>
                                        <h2 className="mb-0 text-success">{dashboardData.financial.avgOrderValue.toFixed(2)} ₺</h2>
                                        <small className="text-muted">Sipariş başına</small>
                                    </div>
                                    <div className="bg-light rounded p-2">
                                        <i className="fas fa-receipt fa-lg text-success"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="card-title text-muted mb-2">MEMNUNİYET ORANI</h6>
                                        <h2 className="mb-0 text-info">{dashboardData.insights.customerMetrics.satisfactionRate}/5</h2>
                                        <small className="text-muted">{dashboardData.insights.customerMetrics.returningCustomers} tekrar eden müşteri</small>
                                    </div>
                                    <div className="bg-light rounded p-2">
                                        <i className="fas fa-star fa-lg text-info"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="row g-4">
                    {/* Revenue Trend Chart */}
                    <div className="col-xl-8">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">Gelir Trendi</h5>
                                <small className="text-muted">Zaman içinde gelir ve sipariş dağılımı</small>
                            </div>
                            <div className="card-body">
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={dashboardData.charts.revenueTrend}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                                                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === 'revenue' ? `${value.toLocaleString('tr-TR')} ₺` : value,
                                                name === 'revenue' ? 'Gelir' : 'Sipariş Sayısı'
                                            ]}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#colorRevenue)" />
                                        <Line type="monotone" dataKey="orders" stroke={CHART_COLORS.success} strokeWidth={2} dot={{ fill: CHART_COLORS.success }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="col-xl-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">Kategori Dağılımı</h5>
                                <small className="text-muted">Menü çeşitliliği analizi</small>
                            </div>
                            <div className="card-body">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.charts.categoryDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                                        >
                                            {dashboardData.charts.categoryDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS.grayscale[index % CHART_COLORS.grayscale.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [`${value} ürün`, 'Adet']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Popular Products */}
                    <div className="col-xl-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">Popüler Ürünler</h5>
                                <small className="text-muted">En çok tercih edilen 6 ürün</small>
                            </div>
                            <div className="card-body">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dashboardData.charts.popularProducts} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis type="number" />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={80}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === 'sales' ? `${value} puan` : `${value} ₺`,
                                                name === 'sales' ? 'Popülerlik' : 'Fiyat'
                                            ]}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="sales"
                                            name="Popülerlik Skoru"
                                            fill={CHART_COLORS.primary}
                                            radius={[0, 4, 4, 0]}
                                            barSize={20}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Table Performance */}
                    <div className="col-xl-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">Masa Performansı</h5>
                                <small className="text-muted">En aktif 8 masa</small>
                            </div>
                            <div className="card-body">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dashboardData.charts.tablePerformance}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === 'revenue' ? `${value.toLocaleString('tr-TR')} ₺` :
                                                    name === 'occupancy' ? `${value.toFixed(1)}%` : value,
                                                name === 'revenue' ? 'Gelir' :
                                                    name === 'occupancy' ? 'Doluluk' : 'Sipariş Sayısı'
                                            ]}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="revenue"
                                            name="Gelir"
                                            fill={CHART_COLORS.primary}
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="orders"
                                            name="Sipariş Sayısı"
                                            fill={CHART_COLORS.success}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insights Section */}
                <div className="row g-4 mt-2">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">Önemli İçgörüler</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <h6>⏰ Yoğun Saatler</h6>
                                        <div className="list-group list-group-flush">
                                            {dashboardData.insights.busyHours
                                                .sort((a, b) => b.activity - a.activity)
                                                .slice(0, 5)
                                                .map((hour, index) => (
                                                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                                                        <span>{hour.hour}</span>
                                                        <div className="d-flex align-items-center">
                                                            <div className="progress" style={{ width: '60px', height: '6px' }}>
                                                                <div
                                                                    className="progress-bar bg-warning"
                                                                    style={{ width: `${hour.activity}%` }}
                                                                ></div>
                                                            </div>
                                                            <small className="text-muted ms-2">{Math.round(hour.activity)}%</small>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <h6>🏆 En İyi Performans</h6>
                                        <div className="list-group list-group-flush">
                                            {dashboardData.insights.topProducts.map((product, index) => (
                                                <div key={product.id} className="list-group-item d-flex align-items-center px-0 border-0">
                                                    <span className="badge bg-warning me-2">{index + 1}</span>
                                                    <div className="flex-grow-1">
                                                        <div className="fw-bold small">{product.name}</div>
                                                        <div className="text-muted smaller">
                                                            <i className="fas fa-star text-warning me-1"></i>
                                                            {product.averageRating?.toFixed(1) || '4.5'}
                                                        </div>
                                                    </div>
                                                    <span className="badge bg-light text-dark">{product.price} ₺</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <h6>📈 Müşteri İstatistikleri</h6>
                                        <div className="list-group list-group-flush">
                                            <div className="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                                                <span>Tekrar Eden Müşteriler</span>
                                                <strong>{dashboardData.insights.customerMetrics.returningCustomers}%</strong>
                                            </div>
                                            <div className="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                                                <span>Yeni Müşteriler</span>
                                                <strong className="text-success">+{dashboardData.insights.customerMetrics.newCustomers}</strong>
                                            </div>
                                            <div className="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                                                <span>Ortalama Puan</span>
                                                <strong className="text-warning">
                                                    <i className="fas fa-star me-1"></i>
                                                    {dashboardData.insights.customerMetrics.satisfactionRate}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;