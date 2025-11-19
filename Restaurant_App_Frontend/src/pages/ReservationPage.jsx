import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance'; // Servis yazmadık, direkt api kullanalım şimdilik veya servise ekle
import '../styles/home.scss'; // Genel stiller

function ReservationPage() {
    const { user } = useSelector(state => state.auth);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [formData, setFormData] = useState({
        reservationDate: '',
        numberOfGuests: 2,
        specialRequests: ''
    });

    // Masaları Çek
    useEffect(() => {
        api.get('/Table').then(res => setTables(res.data));
    }, []);

    const handleTableSelect = (table) => {
        if (!table.isAvailable) {
            toast.error("Bu masa şu an dolu!");
            return;
        }
        setSelectedTable(table);
        // Modal açılabilir veya form aşağıda belirebilir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTable) {
            toast.warning("Lütfen bir masa seçin."); return;
        }

        const payload = {
            ...formData,
            tableId: selectedTable.id,
            customerName: user?.fullName || user?.email,
            customerPhone: user?.phoneNumber || "Belirtilmedi", // User entity'ye eklemiştik
        };

        try {
            await api.post('/Reservation', payload);
            toast.success("Rezervasyon talebiniz alındı! Admin onayı bekleniyor.");
            setSelectedTable(null);
            // Formu temizle vs.
        } catch (error) {
            toast.error("Rezervasyon oluşturulamadı.");
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <h2 className="text-center mb-4 display-5" style={{ fontFamily: 'Playfair Display' }}>Masa Rezervasyonu</h2>

            {/* MASALARIN GÖRSEL YERLEŞİMİ */}
            <div className="row justify-content-center gap-3 mb-5">
                {tables.map(table => (
                    <div
                        key={table.id}
                        onClick={() => handleTableSelect(table)}
                        className={`card text-center p-3 ${selectedTable?.id === table.id ? 'border-warning shadow' : ''}`}
                        style={{
                            width: '120px',
                            cursor: table.isAvailable ? 'pointer' : 'not-allowed',
                            backgroundColor: table.isAvailable ? '#fff' : '#eee',
                            opacity: table.isAvailable ? 1 : 0.6
                        }}
                    >
                        <i className={`fas fa-chair fa-2x mb-2 ${table.isAvailable ? 'text-success' : 'text-danger'}`}></i>
                        <h5 className="mb-0">{table.tableNumber}</h5>
                        <small>{table.capacity} Kişilik</small>
                        {selectedTable?.id === table.id && <i className="fas fa-check-circle text-warning position-absolute top-0 end-0 m-2"></i>}
                    </div>
                ))}
            </div>

            {/* REZERVASYON FORMU (Sadece masa seçilince görünür) */}
            {selectedTable && (
                <div className="row justify-content-center fade-in-up">
                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 p-4">
                            <h4 className="mb-3">Rezervasyon Detayları: {selectedTable.tableNumber}</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label>Tarih ve Saat</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.reservationDate}
                                        onChange={e => setFormData({ ...formData, reservationDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Kişi Sayısı</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.numberOfGuests}
                                        max={selectedTable.capacity}
                                        onChange={e => setFormData({ ...formData, numberOfGuests: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Özel İstekler</label>
                                    <textarea
                                        className="form-control"
                                        value={formData.specialRequests}
                                        onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-dark w-100 py-2">Talep Gönder</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReservationPage;