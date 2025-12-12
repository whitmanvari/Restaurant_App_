import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { tableService } from '../../services/tableService';
import { reservationService } from '../../services/reservationService';
import api from '../../api/axiosInstance';
import TableFormModal from '../../components/Admin/Table/TableFormModal';
import TableStatusCard from '../../components/Admin/Table/TableStatusCard';
import TableDetailModal from '../../components/Admin/Table/TableDetailModal';
import ReservationEditModal from '../../components/ReservationEditModal';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminTablesPage() {
    // --- STATE ---
    const [tables, setTables] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtreleme
    const [filterStatus, setFilterStatus] = useState('all'); 
    const [searchTerm, setSearchTerm] = useState('');

    // Modallar
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [selectedTableData, setSelectedTableData] = useState(null); 
    const [selectedReservation, setSelectedReservation] = useState(null); 

    // Chart Renkleri
    const COLORS = { occupied: '#dc3545', empty: '#198754', reserved: '#0dcaf0', future: '#6f42c1', closed: '#6c757d' };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); 
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [tableRes, resData, orderRes] = await Promise.all([
                tableService.getAll(),
                reservationService.getAll(),
                api.get('/OrderInRestaurant/all/details')
            ]);

            // Masaları A1, A2, A10 gibi doğal sırala
            const sortedTables = tableRes.sort((a, b) => a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true }));
            
            setTables(sortedTables);
            setReservations(resData);
            
            // Sadece aktif siparişleri al
            const activeOnes = orderRes.data.filter(o => o.status !== 'Completed' && o.status !== 'Canceled');
            setActiveOrders(activeOnes);
            
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Veriler alınamadı.");
        }
    };

    // --- MASA DURUMU BELİRLEME ---
    const getTableStatusObj = (table) => {
        // 0. Masa Kapalı mı?
        if (!table.isAvailable) 
            return { status: 'closed', text: 'KAPALI', color: 'secondary', icon: 'fa-ban', subText: 'Servis Dışı' };

        // 1. Canlı Sipariş Var mı? (ÖNCELİK 1 - Müşteri oturuyorsa rezervasyonun önemi yoktur)
        const activeOrder = activeOrders.find(o => o.tableId === table.id);
        if (activeOrder) {
            if (activeOrder.status === 'Pending') 
                return { status: 'occupied', text: 'ONAY BEK.', color: 'warning', subText: 'Yeni Sipariş', icon: 'fa-bell', data: activeOrder };
            
            return { status: 'occupied', text: 'DOLU', color: 'danger', subText: `${activeOrder.totalAmount} ₺`, icon: 'fa-utensils', data: activeOrder };
        }

        // 2. Rezervasyon Var mı? (ÖNCELİK 2 - Hem Bugün Hem Gelecek)
        const now = new Date();
        
        // Bu masaya ait, İptal/Red edilmemiş TÜM gelecek rezervasyonları bul
        const upcomingReservations = reservations.filter(r => {
            if (r.tableId !== table.id) return false;
            if (r.status === 2 || r.status === 3) return false; // Red/İptal hariç

            const resDate = new Date(r.reservationDate);
            // Geçmiş rezervasyonları (Dünden kalanları) gösterme
            // Ama bugünün geçmiş saatleri kalsın (müşteri gelmemiş olabilir)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            return resDate > yesterday;
        });

        // Tarihe göre sırala (En yakın tarih en üstte)
        upcomingReservations.sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));

        // En yakın rezervasyonu al
        const nearestRes = upcomingReservations[0];

        if (nearestRes) {
            const resDate = new Date(nearestRes.reservationDate);
            const isToday = resDate.toDateString() === now.toDateString();
            const timeStr = resDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const dateStr = resDate.toLocaleDateString('tr-TR', {day: 'numeric', month: 'short'}); // 12 Ara
            
            const isPending = nearestRes.status === 0;

            if (isToday) {
                // --- DURUM A: BUGÜN REZERVASYON VAR ---
                return { 
                    status: 'reserved', 
                    text: isPending ? 'TALEP' : 'REZERVE', 
                    color: isPending ? 'info' : 'primary', // Mavi / Lacivert
                    subText: `Bugün ${timeStr}`, 
                    icon: isPending ? 'fa-question' : 'fa-clock',
                    data: nearestRes 
                };
            } else {
                // --- DURUM B: İLERİ TARİHLİ REZERVASYON ---
                return { 
                    status: 'future', 
                    text: isPending ? 'GEL. TALEP' : 'İLERİ TARİH', 
                    color: 'purple', 
                    customColor: '#6f42c1', // Mor renk
                    subText: `${dateStr} - ${timeStr}`, 
                    icon: 'fa-calendar-alt',
                    data: nearestRes 
                };
            }
        }

        // 3. Hiçbiri yoksa BOŞ
        return { status: 'empty', text: 'MÜSAİT', color: 'success', subText: `${table.capacity} Kişilik`, icon: 'fa-chair' };
    };

    // --- CHART DATA ---
    const getChartData = () => {
        const counts = { occupied: 0, empty: 0, reserved: 0, future: 0, closed: 0 };
        tables.forEach(t => {
            const s = getTableStatusObj(t).status;
            counts[s] = (counts[s] || 0) + 1;
        });
        return [
            { name: 'Dolu', value: counts.occupied, color: COLORS.occupied },
            { name: 'Müsait', value: counts.empty, color: COLORS.empty },
            { name: 'Rezerve', value: counts.reserved, color: COLORS.reserved },
            { name: 'Gelecek', value: counts.future, color: COLORS.future },
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
        else if (statusObj.status === 'reserved' || statusObj.status === 'future') setSelectedReservation(statusObj.data);
    };

    const filteredTables = tables.filter(t => {
        const status = getTableStatusObj(t).status;
        const matchesSearch = t.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display' }}>Masa Yönetimi</h2>
                    <p className="text-muted">Salon durumu ve hızlı işlemler.</p>
                </div>
                <button className="btn btn-dark" onClick={() => { setEditingTable(null); setShowFormModal(true); }}>
                    <i className="fas fa-plus me-2"></i> Yeni Masa Ekle
                </button>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-3 bg-light h-100">
                        <div className="d-flex flex-wrap gap-3 align-items-center h-100">
                            <div className="input-group" style={{ maxWidth: '250px' }}>
                                <span className="input-group-text bg-white border-0"><i className="fas fa-search text-muted"></i></span>
                                <input type="text" className="form-control border-0" placeholder="Masa No Ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            
                            <div className="btn-group shadow-sm">
                                {['all', 'empty', 'occupied', 'reserved', 'future'].map(type => (
                                    <button 
                                        key={type}
                                        className={`btn btn-sm px-3 ${filterStatus === type ? 'btn-white text-dark fw-bold border' : 'btn-light text-muted'}`}
                                        onClick={() => setFilterStatus(type)}
                                        style={{textTransform: 'capitalize'}}
                                    >
                                        {type === 'all' ? 'Tümü' : 
                                         type === 'occupied' ? 'Dolu' : 
                                         type === 'empty' ? 'Boş' : 
                                         type === 'reserved' ? 'Bugün Rez.' : 'Gelecek Rez.'}
                                    </button>
                                ))}
                            </div>
                            <div className="ms-auto fw-bold text-muted small">
                                {filteredTables.length} Masa Listeleniyor
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100 d-flex flex-row align-items-center px-3" style={{maxHeight:'100px'}}>
                        <div style={{ width: '80px', height: '80px' }}>
                            <ResponsiveContainer width="100%" height="100%">
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
           {/* --- MASA LİSTESİ --- */}
           <div className="row g-3"> {/* g-3: Kartlar arası boşluk */}
                {filteredTables.map(table => {
                    const statusObj = getTableStatusObj(table);
                    
                    // Mor renk (Gelecek Rezervasyon) için 
                    const cardStyle = statusObj.status === 'future' 
                        ? { borderTop: `5px solid ${statusObj.customColor}` } 
                        : {};
                    
                    return (
                        <div key={table.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                            <TableStatusCard 
                                table={table}
                                statusObj={statusObj}
                                style={cardStyle} // Stili prop olarak gönderdik
                                onClick={handleCardClick}
                                onEdit={(t) => { setEditingTable(t); setShowFormModal(true); }}
                                onDelete={handleDelete}
                            />
                        </div>
                    );
                })}
                
                {filteredTables.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <div className="text-muted opacity-50">
                            <i className="fas fa-search fa-3x mb-3"></i>
                            <p>Kriterlere uygun masa bulunamadı.</p>
                        </div>
                    </div>
                )}
            </div>

            <TableFormModal 
                show={showFormModal} 
                onClose={() => setShowFormModal(false)} 
                onSubmit={handleFormSubmit}
                initialData={editingTable}
            />

            {selectedTableData && (
                <TableDetailModal
                    table={selectedTableData.table}
                    activeOrder={selectedTableData.order}
                    onClose={() => setSelectedTableData(null)}
                    onUpdate={fetchData}
                />
            )}

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