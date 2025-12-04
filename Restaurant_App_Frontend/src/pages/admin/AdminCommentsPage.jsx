import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { commentService } from '../../services/commentService';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function AdminCommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const data = await commentService.getAll();
            setComments(data);
            
            // --- GRAFİK VERİSİNİ HAZIRLA ---
            // Ürünlere göre yorum sayılarını grupla
            const grouped = {};
            data.forEach(c => {
                const pName = c.productName || 'Diğer';
                grouped[pName] = (grouped[pName] || 0) + 1;
            });

            // Grafik formatına çevir [{name: 'Kola', count: 5}]
            const chart = Object.keys(grouped).map(key => ({
                name: key,
                YorumSayisi: grouped[key]
            })).sort((a, b) => b.YorumSayisi - a.YorumSayisi).slice(0, 10); // İlk 10 ürün

            setChartData(chart);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Yorumlar yüklenemedi.");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Yorumu silmek istiyor musunuz?")) return;
        try {
            await commentService.remove(id);
            toast.success("Yorum silindi.");
            fetchComments(); // Listeyi ve grafiği yenile
        } catch { toast.error("Silinemedi."); }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{fontFamily: 'Playfair Display'}}>Yorum Yönetimi</h2>
                    <p className="text-muted">Kullanıcı değerlendirmeleri ve popülarite analizi.</p>
                </div>
                <div className="badge bg-dark fs-6 p-2">Toplam {comments.length} Yorum</div>
            </div>
            
            {/* ÜST KISIM: GRAFİK */}
            {chartData.length > 0 && (
                <div className="card border-0 shadow-sm mb-5">
                    <div className="card-header bg-white py-3">
                        <h5 className="mb-0 text-warning"><i className="fas fa-chart-bar me-2"></i> En Çok Konuşulan Ürünler</h5>
                    </div>
                    <div className="card-body" style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} style={{fontSize: '0.8rem', fontWeight: 'bold'}} />
                                <Tooltip cursor={{fill: '#f8f9fa'}} />
                                <Legend />
                                <Bar dataKey="YorumSayisi" name="Yorum Sayısı" fill="#c5a059" radius={[0, 4, 4, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ALT KISIM: TABLO */}
            <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Kullanıcı</th>
                                <th>Ürün</th>
                                <th style={{width: '40%'}}>Yorum</th>
                                <th>Puan</th>
                                <th>Tarih</th>
                                <th className="text-end pe-4">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map(comment => (
                                <tr key={comment.id}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width:'35px', height:'35px', fontSize:'0.8rem'}}>
                                                {comment.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="fw-bold text-dark">{comment.userName}</div>
                                        </div>
                                    </td>
                                    <td><span className="badge bg-light text-dark border">{comment.productName}</span></td>
                                    <td>
                                        <small className="text-muted">{comment.text}</small>
                                    </td>
                                    <td>
                                        <div className="text-warning small">
                                            {[...Array(comment.ratingValue)].map((_,i) => <i key={i} className="fas fa-star"></i>)}
                                        </div>
                                    </td>
                                    <td className="text-muted small">{new Date(comment.createdDate).toLocaleDateString()}</td>
                                    <td className="text-end pe-4">
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(comment.id)} title="Sil">
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}