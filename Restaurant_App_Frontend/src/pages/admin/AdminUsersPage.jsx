import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtreleme State'leri
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCity, setFilterCity] = useState('');
    
    // Modal & Form
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterData();
    }, [users, searchTerm, filterCity]);

    const fetchData = async () => {
        try {
            const data = await userService.getAll();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Kullanıcılar yüklenemedi.");
            setLoading(false);
        }
    };

    const filterData = () => {
        let result = users;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(user => 
                (user.fullName && user.fullName.toLowerCase().includes(lowerTerm)) ||
                (user.email && user.email.toLowerCase().includes(lowerTerm))
            );
        }
        if (filterCity && filterCity !== 'Tümü') {
            result = result.filter(user => 
                user.city && user.city.toLowerCase() === filterCity.toLowerCase()
            );
        }
        setFilteredUsers(result);
    };

    const cities = ['Tümü', ...new Set(users.map(u => u.city).filter(c => c))];

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({
            // Eğer veri null ise boş string ata
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            city: user.city || '',
            address: user.address || '',
            role: user.role || 'User'
        });
        setShowModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        try {
            await userService.remove(id);
            toast.success("Kullanıcı silindi.");
            fetchData();
        } catch (error) {
            toast.error("Silme işlemi başarısız.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.update(selectedUser.id, formData);
            toast.success("Kullanıcı güncellendi.");
            setShowModal(false);
            fetchData();
        } catch (error) {
            // Hata detayını göster
            console.error(error); 
            toast.error("Güncelleme başarısız.");
        }
    };

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Kullanıcı Yönetimi</h2>
                    <p className="text-muted">Toplam {users.length} kayıtlı kullanıcı.</p>
                </div>
            </div>

            {/* FİLTRE ALANI */}
            <div className="card border-0 shadow-sm mb-4 p-3 bg-light">
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                            <input 
                                type="text" 
                                className="form-control border-start-0" 
                                placeholder="İsim veya E-posta ile ara..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                            <option value="Tümü">Tüm Şehirler</option>
                            {cities.filter(c => c !== 'Tümü').map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* TABLO */}
            <div className="card border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-main)' }}>
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Kullanıcı</th>
                                <th>İletişim</th>
                                <th>Konum</th>
                                <th>Rol</th>
                                <th className="text-end pe-4">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <div className="fw-bold">{user.fullName}</div>
                                                    <small className="text-muted">{user.email}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.phoneNumber || '-'}</td>
                                        <td>{user.city || '-'}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'Admin' ? 'bg-danger' : 'bg-info text-dark'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(user)} title="Düzenle">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(user.id)} title="Sil">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        Aradığınız kriterlere uygun kullanıcı bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DÜZENLEME MODALI */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Kullanıcıyı Düzenle</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Ad Soyad</label>
                                        {/* Değerler boş string || ile korunuyor */}
                                        <input type="text" className="form-control" value={formData.fullName || ''} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Telefon</label>
                                            <input type="text" className="form-control" value={formData.phoneNumber || ''} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Şehir</label>
                                            <input type="text" className="form-control" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Adres</label>
                                        <textarea className="form-control" rows="2" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Rol</label>
                                        <select className="form-select" value={formData.role || 'User'} onChange={e => setFormData({...formData, role: e.target.value})}>
                                            <option value="User">User (Standart)</option>
                                            <option value="Admin">Admin (Yönetici)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                                    <button type="submit" className="btn btn-dark">Güncelle</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}