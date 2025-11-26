import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../services/productService';
import { commentService } from '../services/commentService';
import { ratingService } from '../services/ratingService';
import { addProductToCart } from '../store/slices/cartSlice';
import { getImageUrl } from '../utils/imageHelper';
import { Allergens } from '../constants/allergens';
import { toast } from 'react-toastify';
import '../styles/home.scss'; // Genel tasarım dili için

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);

    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Yorum Formu
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);

    // Galeri
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [prodData, commData, ratingData] = await Promise.all([
                productService.getById(id), // Serviste bu metodun olduğundan emin ol
                commentService.getByProduct(id),
                ratingService.getAverage(id)
            ]);
            setProduct(prodData);
            setComments(commData);
            setAverageRating(ratingData.averageRating || 0);
            setLoading(false);
        } catch (error) {
            // Hata olursa menüye dön
            console.error(error);
            toast.error("Ürün bulunamadı.");
            navigate('/menu');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info("Yorum yapmak için giriş yapmalısınız.");
            navigate('/login');
            return;
        }
        setSubmitting(true);
        try {
            await commentService.create({
                text: newComment,
                productId: parseInt(id),
                ratingValue: newRating
            });
            toast.success("Yorumunuz eklendi.");
            setNewComment('');
            loadData(); // Listeyi yenile
        } catch (error) {
            toast.error("Yorum eklenirken hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if(!window.confirm("Yorumu silmek istediğinize emin misiniz?")) return;
        try {
            await commentService.remove(commentId);
            toast.success("Yorum silindi.");
            loadData();
        } catch (error) {
            toast.error("Silme başarısız.");
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.info("Sipariş vermek için giriş yapın.");
            navigate('/login');
            return;
        }
        dispatch(addProductToCart({ productId: product.id, quantity: 1 }));
        toast.success(`${product.name} sepete eklendi.`);
    };

    if (loading) return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;
    if (!product) return null;

    // Alerjen Hesaplama (Bitwise)
    const activeAllergens = Allergens.filter(a => (product.allergic & a.id) === a.id);

    return (
        <div className="container mt-5 pt-5 mb-5 fade-in-up">
            
            <div className="row g-5">
                {/* SOL: RESİM GALERİSİ */}
                <div className="col-lg-6">
                    <div className="product-gallery">
                        <div className="main-image mb-3 rounded overflow-hidden shadow-sm" style={{height: '450px'}}>
                            <img 
                                src={getImageUrl(product.imageUrls?.[activeImageIndex])} 
                                alt={product.name} 
                                className="w-100 h-100"
                                style={{objectFit: 'cover'}}
                            />
                        </div>
                        {/* Küçük Resimler */}
                        {product.imageUrls?.length > 1 && (
                            <div className="d-flex gap-2 overflow-auto">
                                {product.imageUrls.map((url, idx) => (
                                    <img 
                                        key={idx}
                                        src={getImageUrl(url)} 
                                        alt={`thumb-${idx}`}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`rounded cursor-pointer border ${idx === activeImageIndex ? 'border-warning' : ''}`}
                                        style={{width: '80px', height: '80px', objectFit: 'cover', cursor:'pointer'}}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* SAĞ: BİLGİLER */}
                <div className="col-lg-6">
                    <h6 className="text-warning text-uppercase fw-bold mb-2" style={{letterSpacing:'2px'}}>{product.categoryName}</h6>
                    <h1 className="display-4 mb-3" style={{fontFamily: 'Playfair Display'}}>{product.name}</h1>
                    
                    <div className="d-flex align-items-center mb-4">
                        <div className="text-warning me-2">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star ${i < Math.round(averageRating) ? '' : 'text-muted opacity-25'}`}></i>
                            ))}
                        </div>
                        <span className="text-muted small">({comments.length} Değerlendirme)</span>
                    </div>

                    <h2 className="text-success fw-bold mb-4">{product.price} ₺</h2>
                    
                    <p className="text-muted lead mb-4" style={{lineHeight:'1.8'}}>{product.description}</p>

                    {/* YENİ: İÇİNDEKİLER */}
                    {product.ingredients && (
                        <div className="mb-4 p-3 bg-light rounded border-start border-4 border-warning">
                            <h6 className="fw-bold mb-2 text-dark"><i className="fas fa-mortar-pestle me-2"></i>İçindekiler</h6>
                            <p className="mb-0 text-secondary">{product.ingredients}</p>
                        </div>
                    )}

                    {/* ALERJEN UYARISI */}
                    {activeAllergens.length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-bold small text-danger text-uppercase mb-2">Alerjen Uyarısı</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {activeAllergens.map(alg => (
                                    <span key={alg.id} className="badge bg-danger bg-opacity-10 text-danger border border-danger">
                                        <i className={`${alg.icon} me-1`}></i> {alg.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="d-grid gap-2 mt-5">
                        <button className="btn btn-dark py-3 text-uppercase fw-bold" style={{letterSpacing:'1px'}} onClick={handleAddToCart}>
                            <i className="fas fa-shopping-basket me-2"></i> Sepete Ekle
                        </button>
                    </div>
                </div>
            </div>

            <hr className="my-5" />

            {/* YORUMLAR BÖLÜMÜ */}
            <div className="row">
                <div className="col-lg-8">
                    <h3 className="mb-4" style={{fontFamily: 'Playfair Display'}}>Müşteri Yorumları</h3>
                    
                    {/* Yorum Formu */}
                    {isAuthenticated ? (
                        <div className="card border-0 shadow-sm mb-5 bg-light">
                            <div className="card-body p-4">
                                <h5 className="mb-3">Deneyimini Paylaş</h5>
                                <form onSubmit={handleCommentSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Puanınız</label>
                                        <div className="d-flex gap-2">
                                            {[1,2,3,4,5].map(star => (
                                                <i key={star} 
                                                   className={`fas fa-star fa-lg cursor-pointer ${star <= newRating ? 'text-warning' : 'text-secondary opacity-25'}`}
                                                   onClick={() => setNewRating(star)}
                                                ></i>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <textarea 
                                            className="form-control border-0" 
                                            rows="3" 
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            placeholder="Lezzet, servis ve atmosfer nasıldı?"
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-dark px-4" disabled={submitting}>
                                        {submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-light border text-center py-4">
                            Yorum yapmak için <a href="/login" className="fw-bold text-dark">giriş yapmalısınız</a>.
                        </div>
                    )}

                    {/* Yorum Listesi */}
                    <div className="comment-list">
                        {comments.length === 0 ? (
                            <p className="text-muted">Henüz yorum yapılmamış.</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="card border-0 shadow-sm mb-3">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{width:'45px', height:'45px'}}>
                                                    {comment.userId ? comment.userId.substring(0,1).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{comment.userId?.split('@')[0] || 'Kullanıcı'}</h6>
                                                    <div className="text-warning small">
                                                        {[...Array(comment.ratingValue)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                                    </div>
                                                </div>
                                            </div>
                                            {(user?.role === 'Admin' || user?.email === comment.userId) && (
                                                <button className="btn btn-sm text-danger" onClick={() => handleDeleteComment(comment.id)}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-muted mb-0 mt-3">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}