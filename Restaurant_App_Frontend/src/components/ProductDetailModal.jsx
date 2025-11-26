import React, { useEffect, useState } from 'react';
import { commentService } from '../services/commentService';
import { ratingService } from '../services/ratingService';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageHelper'; 

function ProductDetailModal({ product, onClose }) {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const [comments, setComments] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);

    // Yeni Yorum State
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            loadData();
        }
    }, [product]);

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
        try {
            await commentService.remove(commentId);
            toast.success("Yorum silindi.");
            loadData(); // Listeyi yenile
        } catch (error) {
            toast.error("Silme yetkiniz yok veya hata oluştu.");
        }
    };

    const loadData = async () => {
        try {
            const [commentsData, avgData] = await Promise.all([
                commentService.getByProduct(product.id),
                ratingService.getAverage(product.id)
            ]);
            setComments(commentsData);
            setAverageRating(avgData.averageRating);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.warning("Yorum yapmak için giriş yapmalısınız.");
            return;
        }
        setSubmitting(true);
        try {
            await commentService.create({
                text: newComment,
                productId: product.id,
                ratingValue: parseInt(newRating)
            });
            toast.success("Yorumunuz eklendi!");
            setNewComment('');
            setNewRating(5);
            loadData(); // Listeyi yenile
        } catch (error) {
            toast.error("Yorum eklenirken hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.info("Lütfen önce giriş yapın."); return;
        }
        dispatch(addProductToCart({ productId: product.id, quantity: 1 }));
        toast.success(`${product.name} sepete eklendi.`);
        onClose();
    };

    if (!product) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0">
                    <div className="modal-header border-0">
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-0">
                        <div className="row g-0">
                            {/* SOL Taraf*/}
                            <div className="col-md-5 bg-light d-flex flex-column align-items-center justify-content-center p-4 text-center">
                                {/*getImageUrl kullanımı */}
                                <img
                                    src={getImageUrl(product.imageUrls?.[0])}
                                    className="img-fluid rounded shadow-sm mb-3"
                                    style={{ maxHeight: '250px', objectFit: 'cover' }}
                                    alt={product.name}
                                />
                                <h3 style={{ fontFamily: 'Playfair Display' }}>{product.name}</h3>
                                <div className="text-warning mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fas fa-star ${i < Math.round(averageRating) ? '' : 'text-muted opacity-25'}`}></i>
                                    ))}
                                    <span className="text-dark ms-2 small">({averageRating.toFixed(1)})</span>
                                </div>
                                <p className="text-muted small">{product.description}</p>
                                <h4 className="text-success fw-bold my-3">{product.price} ₺</h4>
                                <button className="btn btn-dark w-100" onClick={handleAddToCart}>
                                    <i className="fas fa-cart-plus me-2"></i> Sepete Ekle
                                </button>
                            </div>

                            {/* SAĞ Taraf */}
                            <div className="col-md-7 p-4">
                                <h5 className="mb-3">Müşteri Yorumları ({comments.length})</h5>

                                <div className="comment-list mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {loading ? <div className="spinner-border spinner-border-sm"></div> : (
                                        comments.length === 0 ? <p className="text-muted small">Henüz yorum yok.</p> :
                                            comments.map(comment => (
                                                <div key={comment.id} className="mb-3 border-bottom pb-2 position-relative">

                                                    {/* Admin veya Yorum Sahibi için Silme Butonu */}
                                                    {(user?.role === 'Admin' || user?.email === comment.userId) && (
                                                        <button
                                                            className="btn btn-sm text-danger position-absolute top-0 end-0 p-0"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            title="Yorumu Sil"
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    )}

                                                    <div className="d-flex justify-content-between align-items-center">
                                                        {/*userName kullanımı */}
                                                        <strong className="small">{comment.userName || 'Misafir'}</strong>
                                                        
                                                        <span className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                                                            {new Date(comment.createdDate).toLocaleDateString('tr-TR')}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="text-warning small mb-1">
                                                        {[...Array(comment.ratingValue)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                                    </div>
                                                    
                                                    <p className="small text-muted mb-1 mt-1">{comment.text}</p>
                                                </div>
                                            ))
                                    )}
                                </div>
                                {/* Form kısmı*/}
                                {isAuthenticated ? (
                                    <form onSubmit={handleSubmitComment} className="bg-light p-3 rounded">
                                        <h6 className="mb-2">Fikrini Paylaş</h6>
                                        <div className="mb-2">
                                            <label className="small me-2">Puanın:</label>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <i key={num} className={`fas fa-star cursor-pointer ${num <= newRating ? 'text-warning' : 'text-secondary opacity-25'}`} onClick={() => setNewRating(num)} style={{ cursor: 'pointer', marginRight: '2px' }}></i>
                                            ))}
                                        </div>
                                        <textarea className="form-control form-control-sm mb-2" placeholder="Yorumunuz..." rows="2" value={newComment} onChange={e => setNewComment(e.target.value)} required></textarea>
                                        <button type="submit" className="btn btn-sm btn-outline-dark w-100" disabled={submitting}>{submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}</button>
                                    </form>
                                ) : (
                                    <div className="alert alert-light text-center small">Yorum yapmak için <a href="/login">giriş yapın</a>.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailModal;