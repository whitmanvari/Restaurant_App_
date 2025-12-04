import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosInstance'; 

export default function AdminCommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {            
            const productsRes = await api.get('/Product/GetAll'); // Tüm ürünler
            const allComments = [];
            
            for (const product of productsRes.data) {
                if (product.imageUrls) { 
                     const comms = await api.get(`/Comment/ByProduct/${product.id}`);
                     // Ürün adını yoruma ekleyelim ki tabloda görünsün
                     const commsWithProdName = comms.data.map(c => ({...c, productName: product.name}));
                     allComments.push(...commsWithProdName);
                }
            }
            
            setComments(allComments);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Yorumu silmek istiyor musunuz?")) return;
        try {
            await api.delete(`/Comment/Delete/${id}`);
            toast.success("Yorum silindi.");
            // Listeden çıkar
            setComments(comments.filter(c => c.id !== id));
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    return (
        <div className="container mt-5 pt-5">
            <h2 className="mb-4" style={{fontFamily: 'Playfair Display'}}>Yorum Yönetimi</h2>
            
            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Kullanıcı</th>
                                <th>Ürün</th>
                                <th>Yorum</th>
                                <th>Puan</th>
                                <th>Tarih</th>
                                <th className="text-end pe-4">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map(comment => (
                                <tr key={comment.id}>
                                    <td className="ps-4 fw-bold">{comment.userName || 'Misafir'}</td>
                                    <td><span className="badge bg-light text-dark border">{comment.productName}</span></td>
                                    <td title={comment.text}>
                                        {comment.text.length > 50 ? comment.text.substring(0,50)+'...' : comment.text}
                                    </td>
                                    <td>
                                        <span className="text-warning">
                                            <i className="fas fa-star"></i> {comment.ratingValue}
                                        </span>
                                    </td>
                                    <td>{new Date(comment.createdDate).toLocaleDateString()}</td>
                                    <td className="text-end pe-4">
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(comment.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {comments.length === 0 && <tr><td colSpan="6" className="text-center py-4">Hiç yorum yok.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}