import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { commentService } from '../../services/commentService';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function AdminCommentsPage() {
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]); // Filtrelenmiş liste
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    
    // Filtre State'leri
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all'); // 'all', '5', '4', ...

    // Modal State
    const [selectedComment, setSelectedComment] = useState(null);

    useEffect(() => {
        fetchComments();
    }, []);

    // Arama veya Filtre değişince listeyi güncelle
    useEffect(() => {
        filterData();
    }, [searchTerm, ratingFilter, comments]);

    const fetchComments = async () => {
        try {
            const data = await commentService.getAll();
            setComments(data);
            
            // Grafik Verisi Hazırla
            const grouped = {};
            data.forEach(c => {
                const pName = c.productName || 'Diğer';
                grouped[pName] = (grouped[pName] || 0) + 1;
            });

            const chart = Object.keys(grouped).map(key => ({
                name: key,
                YorumSayisi: grouped[key]
            })).sort((a, b) => b.YorumSayisi - a.YorumSayisi).slice(0, 10);

            setChartData(chart);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Yorumlar yüklenemedi.");
            setLoading(false);
        }
    };

    const filterData = () => {
        let result = comments;

        // 1. Arama Filtresi (Kullanıcı Adı, Ürün Adı veya Yorum İçeriği)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(c => 
                (c.userName && c.userName.toLowerCase().includes(lowerTerm)) ||
                (c.productName && c.productName.toLowerCase().includes(lowerTerm)) ||
                (c.text && c.text.toLowerCase().includes(lowerTerm))
            );
        }

        // 2. Puan Filtresi
        if (ratingFilter !== 'all') {
            const rating = parseInt(ratingFilter);
            result = result.filter(c => c.ratingValue === rating);
        }

        setFilteredComments(result);
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Yorumu silmek istiyor musunuz?")) return;
        try {
            await commentService.remove(id);
            toast.success("Yorum silindi.");
            fetchComments(); 
            setSelectedComment(null); // Modalı kapat
        } catch { toast.error("Silinemedi."); }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{fontFamily: 'Playfair Display'}}>Yorum Yönetimi</h2>
                    <p className="text-muted">Toplam {comments.length} yorum arasından {filteredComments.length} adet gösteriliyor.</p>
                </div>
            </div>

            {/*  FİLTRE ALANI  */}
            <div className="card border-0 shadow-sm mb-4 p-3 bg-light">
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-0"><i className="fas fa-search text-muted"></i></span>
                            <input 
                                type="text" 
                                className="form-control border-0" 
                                placeholder="Yorumlarda ara (Kullanıcı, Ürün veya Mesaj)..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select 
                            className="form-select border-0" 
                            value={ratingFilter} 
                            onChange={(e) => setRatingFilter(e.target.value)}
                        >
                            <option value="all">Tüm Puanlar</option>
                            <option value="5">⭐⭐⭐⭐⭐ (5 Yıldız)</option>
                            <option value="4">⭐⭐⭐⭐ (4 Yıldız)</option>
                            <option value="3">⭐⭐⭐ (3 Yıldız)</option>
                            <option value="2">⭐⭐ (2 Yıldız)</option>
                            <option value="1">⭐ (1 Yıldız)</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {/* --- GRAFİK VE TABLO --- */}
            <div className="row g-4">
                {/* Grafik */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                            <h6 className="mb-0 fw-bold">Popüler Ürünler</h6>
                        </div>
                        <div className="card-body" style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} style={{fontSize: '0.75rem'}} />
                                    <Tooltip cursor={{fill: '#f8f9fa'}} />
                                    <Bar dataKey="YorumSayisi" fill="#c5a059" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Tablo */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">Kullanıcı</th>
                                        <th>Puan</th>
                                        <th>Yorum Özeti</th>
                                        <th className="text-end pe-4">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComments.map(comment => (
                                        <tr key={comment.id}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-dark">{comment.userName || 'Misafir'}</div>
                                                <small className="text-muted">{comment.productName}</small>
                                            </td>
                                            <td>
                                                <div className="text-warning small text-nowrap">
                                                    {[...Array(comment.ratingValue)].map((_,i) => <i key={i} className="fas fa-star"></i>)}
                                                </div>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {comment.text.length > 40 ? comment.text.substring(0,40)+'...' : comment.text}
                                                </small>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2" 
                                                    onClick={() => setSelectedComment(comment)} 
                                                    title="Detay"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger" 
                                                    onClick={() => handleDelete(comment.id)} 
                                                    title="Sil"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredComments.length === 0 && <tr><td colSpan="4" className="text-center py-4">Kayıt bulunamadı.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/*DETAY MODALI  */}
            {selectedComment && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Yorum Detayı</h5>
                                <button className="btn-close btn-close-white" onClick={() => setSelectedComment(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 me-3" style={{width:'50px', height:'50px'}}>
                                        {selectedComment.userName ? selectedComment.userName.charAt(0).toUpperCase() : 'M'}
                                    </div>
                                    <div>
                                        <h5 className="mb-0">{selectedComment.userName}</h5>
                                        <small className="text-muted">{new Date(selectedComment.createdDate).toLocaleString()}</small>
                                    </div>
                                </div>

                                <div className="p-3 bg-light rounded border mb-3">
                                    <label className="small text-uppercase fw-bold text-muted mb-1">Ürün</label>
                                    <div className="fw-bold text-dark">{selectedComment.productName}</div>
                                </div>

                                <div className="mb-3">
                                    <label className="small text-uppercase fw-bold text-muted mb-1">Puan</label>
                                    <div className="text-warning fs-5">
                                        {[...Array(selectedComment.ratingValue)].map((_,i) => <i key={i} className="fas fa-star"></i>)}
                                        <span className="text-dark ms-2 fs-6">({selectedComment.ratingValue}/5)</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="small text-uppercase fw-bold text-muted mb-1">Yorum Metni</label>
                                    <p className="lead" style={{fontSize:'1rem'}}>{selectedComment.text}</p>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <button className="btn btn-outline-danger" onClick={() => handleDelete(selectedComment.id)}>
                                    <i className="fas fa-trash-alt me-2"></i> Bu Yorumu Sil
                                </button>
                                <button className="btn btn-secondary" onClick={() => setSelectedComment(null)}>Kapat</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}