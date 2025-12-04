import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { reservationService } from '../../services/reservationService';
import { tableService } from '../../services/tableService';
import api from '../../api/axiosInstance';
import TableDetailModal from '../../components/TableDetailModal';
import ReservationEditModal from '../../components/ReservationEditModal'; 
import { Link } from 'react-router-dom';

function AdminDashboard() {
    const { user } = useSelector(state => state.auth);

    // State'ler
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // MODAL STATE'LERİ
    const [selectedTableData, setSelectedTableData] = useState(null); // Sipariş Detayı
    const [selectedReservation, setSelectedReservation] = useState(null); // Rezervasyon Düzenleme

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [resData, tableRes, orderRes] = await Promise.all([
                reservationService.getAll(),
                tableService.getAll(),
                api.get('/OrderInRestaurant/all/details')
            ]);
            
            setReservations(resData);
            setTables(tableRes.sort((a, b) => a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true })));
            
            const activeOnes = orderRes.data.filter(o => o.status !== 'Completed' && o.status !== 'Canceled');
            setActiveOrders(activeOnes);
            setLoading(false);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    // Masa Durumu Hesaplama
    const getTableStatus = (table) => {
        if (!table.isAvailable) return { status: 'closed', text: 'KAPALI', color: 'secondary', icon: 'fa-ban' };

        // 1. Sipariş Kontrolü
        const activeOrder = activeOrders.find(o => o.tableId === table.id);
        if (activeOrder) {
            if (activeOrder.status === 'Pending') {
                 return { status: 'occupied', text: 'ONAY BEK.', color: 'warning', subText: 'Sipariş Geldi', icon: 'fa-bell', data: activeOrder };
            }
            return { status: 'occupied', text: 'DOLU', color: 'danger', subText: `${activeOrder.totalAmount} ₺`, icon: 'fa-utensils', data: activeOrder };
        }

        // 2. Rezervasyon Kontrolü
        const now = new Date();
        const activeReservation = reservations.find(r => {
            if (r.tableId !== table.id) return false;
            if (r.status !== 1 && r.status !== 0) return false;

            const resDate = new Date(r.reservationDate);
            const isSameDay = resDate.toDateString() === now.toDateString();
            if (!isSameDay) return false;

            const diffMs = resDate.getTime() - now.getTime();
            const diffMinutes = diffMs / (1000 * 60);

            return diffMinutes > -120 && diffMinutes < 120;
        });
        
        if (activeReservation) {
            const isPending = activeReservation.status === 0;
            const timeStr = new Date(activeReservation.reservationDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            return { 
                status: 'reserved', 
                text: isPending ? 'TALEP' : 'REZERVE', 
                color: isPending ? 'info' : 'primary', 
                subText: `Saat: ${timeStr}`,
                icon: 'fa-clock',
                data: activeReservation 
            };
        }

        return { status: 'empty', text: 'MÜSAİT', color: 'success', subText: `${table.capacity} Kişilik`, icon: 'fa-chair' };
    };

    // Masaya Tıklama Olayı
    const handleTableClick = (table, statusObj) => {
        // Eğer Doluysa veya Onay Bekliyorsa -> Sipariş Detayını Aç
        if (statusObj.status === 'occupied') {
            setSelectedTableData({ table: table, order: statusObj.data });
        } 
        // Eğer Rezerveyse -> Rezervasyon Düzenleme Modalını Aç
        else if (statusObj.status === 'reserved') {
            setSelectedReservation(statusObj.data);
        } 
        else {
            toast.info(`Masa ${table.tableNumber}: ${statusObj.text}`);
        }
    };

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-4">
            {/* ... Başlık ve Butonlar ... */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="display-6" style={{ fontFamily: 'Playfair Display' }}>Yönetim Paneli</h1>
                    <p className="text-muted">Salon durumu ve hızlı işlemler.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <Link to="/admin/menu" className="btn btn-outline-dark"><i className="fas fa-utensils me-2"></i> Menü</Link>
                    <Link to="/admin/reservations" className="btn btn-outline-dark"><i className="fas fa-calendar-check me-2"></i> Rezervasyonlar</Link>
                    <Link to="/admin/orders" className="btn btn-outline-dark"><i className="fas fa-tasks me-2"></i> Siparişler</Link>
                    <Link to="/admin/settings" className="btn btn-outline-dark"><i className="fas fa-cog me-2"></i> Ayarlar</Link>
                </div>
            </div>

            <h4 className="mt-4 mb-3" style={{ fontFamily: 'Playfair Display' }}>Salon Durumu</h4>
            
            <div className="row g-3">
                {tables.map(table => {
                    const statusObj = getTableStatus(table);
                    const { color, text, subText, icon } = statusObj;

                    return (
                        <div key={table.id} className="col-6 col-md-4 col-lg-3">
                            <div 
                                className={`card h-100 shadow-sm text-center border-${color} border-2 position-relative`}
                                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => handleTableClick(table, statusObj)}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div className={`card-header py-1 fw-bold text-white bg-${color}`}>
                                    {table.tableNumber}
                                </div>
                                <div className="card-body d-flex flex-column justify-content-center align-items-center p-3">
                                    <i className={`fas ${icon} fa-2x mb-2 text-${color} opacity-75`}></i>
                                    <h6 className={`fw-bold text-${color} mb-0`}>{text}</h6>
                                    <small className="text-muted mt-1">{subText}</small>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* 1. SİPARİŞ DETAY MODALI */}
            {selectedTableData && (
                <TableDetailModal
                    table={selectedTableData.table}
                    activeOrder={selectedTableData.order}
                    onClose={() => setSelectedTableData(null)}
                    onUpdate={fetchData}
                />
            )}

            {/* 2. REZERVASYON DÜZENLEME MODALI  */}
            {selectedReservation && (
                <ReservationEditModal
                    reservation={selectedReservation}
                    onClose={() => setSelectedReservation(null)}
                    onUpdate={() => {
                        fetchData(); // Listeyi ve haritayı yenile
                        setSelectedReservation(null);
                    }}
                />
            )}
        </div>
    );
}

export default AdminDashboard;