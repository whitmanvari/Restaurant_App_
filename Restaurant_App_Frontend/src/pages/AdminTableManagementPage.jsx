import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { tableService } from '../services/tableService';
import { reservationService } from '../services/reservationService';
import api from '../api/axiosInstance';

export default function AdminTableManagementPage() {
    const [tables, setTables] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableHistory, setTableHistory] = useState({ reservations: [], orders: [] });

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [tableRes, resData, orderRes] = await Promise.all([
                tableService.getAll(),
                reservationService.getAll(),
                api.get('/OrderInRestaurant/all/details')
            ]);
            setTables(tableRes);
            setReservations(resData);
            setActiveOrders(orderRes.data);
            setLoading(false);
        } catch (error) {
            toast.error("Veriler yüklenemedi.");
        }
    };

    const getTableStatus = (tableId) => {
        const activeOrder = activeOrders.find(o => 
            o.tableId === tableId && o.status !== 'Completed' && o.status !== 'Canceled'
        );
        if (activeOrder) return { status: 'occupied', text: 'DOLU', color: 'danger', order: activeOrder };

        const now = new Date();
        const activeReservation = reservations.find(r => 
            r.tableId === tableId && 
            (r.status === 1 || r.status === 0) &&
            new Date(r.reservationDate) > now.AddHours(-2) &&
            new Date(r.reservationDate) < now.AddHours(2)
        );
        
        if (activeReservation) {
            const isPending = activeReservation.status === 0;
            return { 
                status: 'reserved', 
                text: isPending ? 'TALEP' : 'REZERVE', 
                color: isPending ? 'info' : 'warning', 
                reservation: activeReservation 
            };
        }

        return { status: 'empty', text: 'MÜSAİT', color: 'success' };
    };

    const handleTableClick = async (table) => {
        setSelectedTable(table);
        const tableResHistory = reservations.filter(r => r.tableId === table.id);
        const currentOrder = activeOrders.find(o => o.tableId === table.id && o.status !== 'Completed');
        setTableHistory({ reservations: tableResHistory, currentOrder: currentOrder });
    };

    Date.prototype.AddHours = function(h) {
        this.setTime(this.getTime() + (h*60*60*1000));
        return this;
    }

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <h2 className="mb-4" style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Masa Yönetimi</h2>
            
            <div className="row g-4">
                {tables.map(table => {
                    const { status, text, color } = getTableStatus(table.id);
                    return (
                        <div key={table.id} className="col-6 col-md-4 col-lg-3" onClick={() => handleTableClick(table)} style={{cursor: 'pointer'}}>
                            <div className={`card h-100 shadow-sm border-${color} border-2`}>
                                <div className={`card-header bg-${color} text-white fw-bold d-flex justify-content-between`}>
                                    <span>{table.tableNumber}</span>
                                    <small>{text}</small>
                                </div>
                                <div className="card-body text-center">
                                    <i className={`fas fa-chair fa-3x text-${color} mb-3 opacity-50`}></i>
                                    <p className="mb-0 small">{table.capacity} Kişilik</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedTable && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Masa {selectedTable.tableNumber} Detayları</h5>
                                <button className="btn-close btn-close-white" onClick={() => setSelectedTable(null)}></button>
                            </div>
                            <div className="modal-body">
                                <ul className="nav nav-tabs mb-3" id="myTab" role="tablist">
                                    <li className="nav-item"><button className="nav-link active text-dark fw-bold" id="active-tab" data-bs-toggle="tab" data-bs-target="#active" type="button">Aktif Durum</button></li>
                                    <li className="nav-item"><button className="nav-link text-dark" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button">Geçmiş</button></li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade show active p-3 border rounded bg-light" id="active">
                                        {tableHistory.currentOrder ? (
                                            <div>
                                                <h6 className="text-success fw-bold mb-3">Şu Anki Sipariş</h6>
                                                <p>Tutar: {tableHistory.currentOrder.totalAmount} ₺</p>
                                            </div>
                                        ) : (
                                            <p className="text-center py-3 text-muted">Aktif sipariş yok.</p>
                                        )}
                                    </div>
                                    <div className="tab-pane fade" id="history">
                                        <ul className="list-group">
                                            {tableHistory.reservations.map(r => (
                                                <li key={r.id} className="list-group-item">
                                                    {new Date(r.reservationDate).toLocaleString()} - {r.customerName}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}