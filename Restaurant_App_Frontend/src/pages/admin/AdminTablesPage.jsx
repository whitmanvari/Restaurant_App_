import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { tableService } from '../../services/tableService';
import { reservationService } from '../../services/reservationService';
import api from '../../api/axiosInstance';
import TableFormModal from '../../components/Admin/Table/TableFormModal';
import TableStatusCard from '../../components/Admin/Table/TableStatusCard';
import TableDetailModal from '../../components/TableDetailModal';
import ReservationEditModal from '../../components/ReservationEditModal';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminTablesPage() {
    // --- STATE ---
    const [tables, setTables] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtreleme
    const [filterStatus, setFilterStatus] = useState('all'); // all, occupied, empty, reserved, closed
    const [searchTerm, setSearchTerm] = useState('');

    // Modallar
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [selectedTableData, setSelectedTableData] = useState(null); // Order Detail
    const [selectedReservation, setSelectedReservation] = useState(null); // Reservation Detail

    // Chart Renkleri
    const COLORS = { occupied: '#dc3545', empty: '#198754', reserved: '#0dcaf0', closed: '#6c757d' };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // 15 sn'de bir yenile
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [tableRes, resData, orderRes] = await Promise.all([
                tableService.getAll(),
                reservationService.getAll(),
                api.get('/OrderInRestaurant/all/details')
            ]);

            // Masaları Sırala (A1, A2...)
            const sortedTables = tableRes.sort((a, b) => a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true }));
            
            setTables(sortedTables);
            setReservations(resData);
            // Sadece aktif siparişleri al
            setActiveOrders(orderRes.data.filter(o => o.status !== 'Completed' && o.status !== 'Canceled'));
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Veriler alınamadı.");
        }
    };

    // --- MASA DURUMU BELİRLEME MANTIĞI ---
    const getTableStatusObj = (table) => {
        if (!table.isAvailable) 
            return { status: 'closed', text: 'KAPALI', color: 'secondary', icon: 'fa-ban', subText: 'Servis Dışı' };

        // 1. Sipariş Var mı?
        const activeOrder = activeOrders.find(o => o.tableId === table.id);
        if (activeOrder) {
            if (activeOrder.status === 'Pending') 
                return { status: 'occupied', text: 'ONAY BEK.', color: 'warning', subText: 'Yeni Sipariş', icon: 'fa-bell', data: activeOrder };
            
            return { status: 'occupied', text: 'DOLU', color: 'danger', subText: `${activeOrder.totalAmount} ₺`, icon: 'fa-utensils', data: activeOrder };
        }

        // 2. Rezervasyon Var mı? (Bugün ve saati yakın mı?)
        const now = new Date();
        const activeRes = reservations.find(r => {
            if (r.tableId !== table.id || (r.status !== 1 && r.status !== 0)) return false;
            const resDate = new Date(r.reservationDate);
            // Sadece bugünü kontrol et
            if (resDate.toDateString() !== now.toDateString()) return false;
            
            const diffMinutes = (resDate - now) / (1000 * 60);
            // Rezervasyona 90 dk kala veya rezervasyon başlayalı 90 dk geçmediyse "Rezerve" göster
            return diffMinutes > -90 && diffMinutes < 90;
        });

        if (activeRes) {
            const timeStr = new Date(activeRes.reservationDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            return { 
                status: 'reserved', 
                text: activeRes.status === 0 ? 'TALEP' : 'REZERVE', 
                color: 'info', 
                subText: timeStr, 
                icon: 'fa-clock',
                data: activeRes 
            };
        }

        // 3. Boş
        return { status: 'empty', text: 'MÜSAİT', color: 'success', subText: `${table.capacity} Kişilik`, icon: 'fa-chair' };
    };

    // --- CHART VERİSİ HAZIRLA ---
    const getChartData = () => {
        const counts = { occupied: 0, empty: 0, reserved: 0, closed: 0 };
        tables.forEach(t => {
            const s = getTableStatusObj(t).status;
            counts[s] = (counts[s] || 0) + 1;
        });
        return [
            { name: 'Dolu', value: counts.occupied, color: COLORS.occupied },
            { name: 'Müsait', value: counts.empty, color: COLORS.empty },
            { name: 'Rezerve', value: counts.reserved, color: COLORS.reserved },
            { name: 'Kapalı', value: counts.closed, color: COLORS.closed }
        ].filter(d => d.value > 0);
    };

    // --- CRUD ---
    const handleFormSubmit = async (formData) => {
        try {
            if (editingTable) {
                await tableService.update(formData.id, formData);
                toast.success("Masa güncellendi.");
            } else {
                await tableService.create(formData);
                toast.success("Masa oluşturuldu.");
            }
            setShowFormModal(false);
            setEditingTable(null);
            fetchData();
        } catch (error) { toast.error("İşlem başarısız."); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Masayı silmek istediğinize emin misiniz?")) return;
        try { await tableService.remove(id); toast.success("Silindi."); fetchData(); }
        catch { toast.error("Silinemedi (Aktif işlem olabilir)."); }
    };

    const handleCardClick = (table, statusObj) => {
        if (statusObj.status === 'occupied') setSelectedTableData({ table, order: statusObj.data });
        else if (statusObj.status === 'reserved') setSelectedReservation(statusObj.data);
        else if (statusObj.status === 'empty') {
             // Boş masaya tıklandığında düzenleme açılabilir veya "Hızlı Rezervasyon" yapılabilir.
             // Şimdilik düzenleme modunu açalım:
             // setEditingTable(table); setShowFormModal(true);
        }
    };

    // --- RENDER ---
    const filteredTables = tables.filter(t => {
        const status = getTableStatusObj(t).status;
        const matchesSearch = t.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container-fluid p-4">
            
            {/* ÜST BAŞLIK */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display' }}>Masa Yönetimi</h2>
                    <p className="text-muted">Salon durumunu izleyin ve düzenleyin.</p>
                </div>
                <button className="btn btn-dark" onClick={() => { setEditingTable(null); setShowFormModal(true); }}>
                    <i className="fas fa-plus me-2"></i> Yeni Masa Ekle
                </button>
            </div>

            <div className="row g-4 mb-4">
                {/* SOL: FİLTRELER */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-3 bg-light h-100">
                        <div className="d-flex flex-wrap gap-3 align-items-center h-100">
                            <div className="input-group" style={{ maxWidth: '250px' }}>
                                <span className="input-group-text bg-white border-0"><i className="fas fa-search text-muted"></i></span>
                                <input type="text" className="form-control border-0" placeholder="Masa No Ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            
                            <div className="btn-group shadow-sm">
                                {['all', 'empty', 'occupied', 'reserved'].map(type => (
                                    <button 
                                        key={type}
                                        className={`btn btn-sm px-3 ${filterStatus === type ? 'btn-white text-dark fw-bold border' : 'btn-light text-muted'}`}
                                        onClick={() => setFilterStatus(type)}
                                        style={{textTransform: 'capitalize'}}
                                    >
                                        {type === 'all' ? 'Tümü' : type === 'occupied' ? 'Dolu' : type === 'empty' ? 'Boş' : 'Rezerve'}
                                    </button>
                                ))}
                            </div>
                            <div className="ms-auto fw-bold text-muted small">
                                {filteredTables.length} Masa Listeleniyor
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAĞ: MİNİ CHART */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100 d-flex flex-row align-items-center px-3" style={{maxHeight:'100px'}}>
                        <div style={{ width: '80px', height: '80px' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={getChartData()} dataKey="value" innerRadius={25} outerRadius={35} paddingAngle={2} isAnimationActive={false}>
                                        {getChartData().map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="ms-3 d-flex flex-wrap gap-3 small">
                            {getChartData().map(d => (
                                <div key={d.name} className="d-flex align-items-center">
                                    <span className="d-inline-block rounded-circle me-1" style={{width:8, height:8, backgroundColor:d.color}}></span>
                                    <span className="text-muted me-1">{d.name}:</span>
                                    <strong>{d.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* MASA LİSTESİ */}
            <div className="row g-3">
                {filteredTables.map(table => (
                    <TableStatusCard 
                        key={table.id}
                        table={table}
                        statusObj={getTableStatusObj(table)}
                        onClick={handleCardClick}
                        onEdit={(t) => { setEditingTable(t); setShowFormModal(true); }}
                        onDelete={handleDelete}
                    />
                ))}
                {filteredTables.length === 0 && <div className="text-center py-5 text-muted w-100">Kriterlere uygun masa bulunamadı.</div>}
            </div>

            {/* --- MODALLAR --- */}
            
            {/* 1. Masa Ekle/Düzenle */}
            <TableFormModal 
                show={showFormModal} 
                onClose={() => setShowFormModal(false)} 
                onSubmit={handleFormSubmit}
                initialData={editingTable}
            />

            {/* 2. Sipariş Detay (Dolu Masa için) */}
            {selectedTableData && (
                <TableDetailModal
                    table={selectedTableData.table}
                    activeOrder={selectedTableData.order}
                    onClose={() => setSelectedTableData(null)}
                    onUpdate={fetchData}
                />
            )}

            {/* 3. Rezervasyon Düzenle (Rezerve Masa için) */}
            {selectedReservation && (
                <ReservationEditModal
                    reservation={selectedReservation}
                    onClose={() => setSelectedReservation(null)}
                    onUpdate={() => { fetchData(); setSelectedReservation(null); }}
                />
            )}
        </div>
    );
}