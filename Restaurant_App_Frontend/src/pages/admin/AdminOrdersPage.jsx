import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { toast } from 'react-toastify';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// Dropdown Stili
const dropdownStyle = { position: 'relative', display: 'inline-block' };

export default function AdminOrdersPage() {
    // --- STATE'LER ---
    const [onlineOrders, setOnlineOrders] = useState([]);
    const [tableOrders, setTableOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('table'); // 'table' veya 'online'

    // --- EKLENEN FİLTRE STATE'LERİ ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const COLORS = ['#C5A059', '#2C2C2C', '#8B7355', '#A0A0A0', '#D4B77E'];

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            const [online, table] = await Promise.all([
                orderService.getAllOnlineOrders(),
                orderService.getAllTableOrders()
            ]);
            
            // Tarih Sıralaması
            const sortByDate = (a, b) => new Date(b.orderDate || Date.now()) - new Date(a.orderDate || Date.now());

            setOnlineOrders(online.sort(sortByDate));
            setTableOrders(table.sort(sortByDate));
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    // --- HELPERLAR ---
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime()) || date.getFullYear() === 1) return "-";
        return date.toLocaleDateString('tr-TR');
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime()) || date.getFullYear() === 1) return "";
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    // --- AKSİYONLAR ---
    const handleTableStatus = async (id, statusStr) => {
        try {
            await orderService.updateTableOrderStatus(id, statusStr);
            toast.success(`Masa güncellendi: ${statusStr}`);
            setOpenDropdownId(null);
            fetchAllData();
        } catch { toast.error("Hata."); }
    };

    const handleOnlineStatus = async (id, statusEnum) => {
        try {
            await orderService.updateOnlineOrderStatus(id, statusEnum);
            toast.success("Paket güncellendi.");
            setOpenDropdownId(null);
            fetchAllData();
        } catch { toast.error("Hata."); }
    };

    // --- FİLTRELEME MANTIĞI  ---
    
    // 1. Masa Siparişleri Filtresi
    const getFilteredTableOrders = () => {
        return tableOrders.filter(order => {
            const s = searchTerm.toLowerCase();
            
            // Arama: ID, Masa No veya İsim
            const matchesSearch = 
                (order.tableNumber && order.tableNumber.toLowerCase().includes(s)) ||
                order.id.toString().includes(s) ||
                (order.userName && order.userName.toLowerCase().includes(s));

            // Statü Filtresi
            const matchesStatus = statusFilter === 'All' ? true : order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    };

    // 2. Online Sipariş Filtresi
    const getFilteredOnlineOrders = () => {
        return onlineOrders.filter(order => {
            const s = searchTerm.toLowerCase();

            // Arama: ID, Email, Telefon
            const matchesSearch = 
                (order.email && order.email.toLowerCase().includes(s)) ||
                (order.orderNum && order.orderNum.toLowerCase().includes(s)) ||
                (order.phone && order.phone.includes(s)) ||
                order.id.toString().includes(s);

            // Statü Filtresi (Enum Mapping)
            let statusEnum = -1;
            if (statusFilter === 'Pending') statusEnum = 0;    // Waiting
            if (statusFilter === 'InProgress') statusEnum = 3; // Preparing
            if (statusFilter === 'Completed') statusEnum = 1;  // Completed
            if (statusFilter === 'Canceled') statusEnum = 2;   // Canceled

            const matchesStatus = statusFilter === 'All' ? true : order.orderState === statusEnum;

            return matchesSearch && matchesStatus;
        });
    };

    // --- CHART DATA ---
    const getChartData = () => {
        const data = {};
        tableOrders.forEach(order => {
            const name = `Masa ${order.tableNumber}`;
            data[name] = (data[name] || 0) + 1;
        });
        return Object.keys(data).map(k => ({ name: k, count: data[k] })).slice(0, 10);
    };

    const renderStatusBadge = (status, type) => {
        const map = {
            'Pending': { color: 'warning', text: 'Onay Bekliyor' },
            'InProgress': { color: 'info', text: 'Hazırlanıyor' },
            'Served': { color: 'primary', text: 'Servis Edildi' },
            'Completed': { color: 'success', text: 'Tamamlandı' },
            'Canceled': { color: 'danger', text: 'İptal' },
            0: { color: 'warning', text: 'Bekliyor' },
            3: { color: 'info', text: 'Hazırlanıyor' },
            1: { color: 'success', text: 'Tamamlandı' },
            2: { color: 'danger', text: 'İptal' }
        };
        const s = map[status] || { color: 'secondary', text: status };
        return <span className={`badge bg-${s.color} bg-opacity-75 text-white px-3 py-2`}>{s.text}</span>;
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    // Filtrelenmiş listeleri al
    const filteredList = activeTab === 'table' ? getFilteredTableOrders() : getFilteredOnlineOrders();

    return (
        <div className="container mt-5 pt-5 mb-5" onClick={() => setOpenDropdownId(null)}>
            
            {/* BAŞLIK VE TABLAR */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Sipariş Yönetimi</h2>
                <div className="btn-group shadow-sm">
                    <button 
                        className={`btn px-4 ${activeTab === 'table' ? 'btn-dark' : 'btn-light'}`} 
                        onClick={() => { setActiveTab('table'); setStatusFilter('All'); }}
                    >
                        Masa
                    </button>
                    <button 
                        className={`btn px-4 ${activeTab === 'online' ? 'btn-dark' : 'btn-light'}`} 
                        onClick={() => { setActiveTab('online'); setStatusFilter('All'); }}
                    >
                        Paket
                    </button>
                </div>
            </div>

            {/* --- ARAMA VE FİLTRELEME ALANI --- */}
            <div className="card border-0 shadow-sm mb-4 p-3 bg-light">
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-0"><i className="fas fa-search text-muted"></i></span>
                            <input 
                                type="text" 
                                className="form-control border-0" 
                                placeholder={activeTab === 'table' ? "Masa No, ID veya Müşteri Ara..." : "Müşteri, Adres veya Sipariş No Ara..."} 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select 
                            className="form-select border-0" 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Tüm Durumlar</option>
                            <option value="Pending">Bekleyenler / Onay Bekleyen</option>
                            <option value="InProgress">Hazırlananlar</option>
                            <option value="Served">Servis Edilenler (Sadece Masa)</option>
                            <option value="Completed">Tamamlananlar</option>
                            <option value="Canceled">İptaller</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* TABLO */}
            <div className="card shadow-sm border-0 mb-5" style={{ minHeight: '400px' }}>
                <div className="table-responsive" style={{ overflow: 'visible' }}>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>{activeTab === 'table' ? 'Masa / Müşteri' : 'Müşteri / Adres'}</th>
                                <th>Tarih</th>
                                <th>Tutar</th>
                                <th>Durum</th>
                                <th className="text-end pe-4">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map(order => (
                                <tr key={order.id}>
                                    <td className="fw-bold ps-4">#{order.id}</td>
                                    <td>
                                        {activeTab === 'table' ? (
                                            <div>
                                                <span className="badge bg-dark me-2">{order.tableNumber}</span>
                                                <span className="fw-bold">{order.userName || 'Misafir'}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="fw-bold">{order.userName || order.email}</div>
                                                <small className="text-muted">{order.city}</small>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="fw-bold">{formatDate(order.orderDate)}</div>
                                        <small className="text-muted">{formatTime(order.orderDate)}</small>
                                    </td>
                                    <td className="text-success fw-bold">{order.totalAmount} ₺</td>
                                    <td>{renderStatusBadge(activeTab === 'table' ? order.status : order.orderState, activeTab)}</td>
                                    <td className="text-end pe-4">
                                        <div className="dropdown" style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
                                            <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" onClick={(e) => toggleDropdown(order.id, e)}>
                                                İşlem
                                            </button>
                                            {openDropdownId === order.id && (
                                                <ul className="dropdown-menu show dropdown-menu-end shadow border-0" style={{ display: 'block', right: 0, zIndex: 9999 }}>
                                                    {activeTab === 'table' ? (
                                                        <>
                                                            <li><button className="dropdown-item" onClick={() => handleTableStatus(order.id, 'InProgress')}>🔥 Hazırla</button></li>
                                                            <li><button className="dropdown-item" onClick={() => handleTableStatus(order.id, 'Served')}>🍽️ Servis Et</button></li>
                                                            <li><button className="dropdown-item text-success" onClick={() => handleTableStatus(order.id, 'Completed')}>✅ Kapat</button></li>
                                                            <li><hr className="dropdown-divider" /></li>
                                                            <li><button className="dropdown-item text-danger" onClick={() => handleTableStatus(order.id, 'Canceled')}>❌ İptal</button></li>
                                                            {(order.status === 'Completed' || order.status === 'Canceled') && (
                                                                <li><button className="dropdown-item text-warning" onClick={() => handleTableStatus(order.id, 'Pending')}>↩️ Geri Al</button></li>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <li><button className="dropdown-item" onClick={() => handleOnlineStatus(order.id, 3)}>🔥 Hazırla</button></li>
                                                            <li><button className="dropdown-item text-success" onClick={() => handleOnlineStatus(order.id, 1)}>✅ Tamamla</button></li>
                                                            <li><button className="dropdown-item text-danger" onClick={() => handleOnlineStatus(order.id, 2)}>❌ İptal</button></li>
                                                        </>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredList.length === 0 && (
                                <tr><td colSpan="6" className="text-center py-5 text-muted">Kayıt Bulunamadı</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* GRAFİK */}
            <div className="card border-0 shadow-sm">
                <div className="card-body" style={{ height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#C5A059">
                                {getChartData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}