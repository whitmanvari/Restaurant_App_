import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { getImageUrl } from '../../utils/imageHelper'; 
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function AdminMenuPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('Tümü');

    // Chart Data
    const [chartData, setChartData] = useState([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: 0, name: '', description: '', price: '', categoryId: '', imageUrl: '' 
    });

    // Renk Paleti 
    const COLORS = ['#C5A059', '#2C2C2C', '#8B7355', '#A0A0A0', '#D4B77E'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodData, catData] = await Promise.all([
                productService.getAll(),
                categoryService.getAll()
            ]);
            setProducts(prodData);
            setCategories(catData);

            // --- GRAFİK VERİSİ HAZIRLA ---
            const stats = catData.map(cat => {
                const count = prodData.filter(p => p.categoryId === cat.id).length;
                return { name: cat.name, count: count };
            }).filter(i => i.count > 0); 
            
            setChartData(stats);
            setLoading(false);
        } catch (error) {
            toast.error("Veriler yüklenemedi.");
            setLoading(false);
        }
    };

    // --- FİLTRELEME ---
    const filteredProducts = filterCategory === 'Tümü' 
        ? products 
        : products.filter(p => p.categoryName === filterCategory || categories.find(c => c.id === p.categoryId)?.name === filterCategory);

    // --- DOSYA SEÇME İŞLEMİ ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.warning("Dosya boyutu çok büyük! Lütfen 2MB altı bir resim seçin.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- CRUD İŞLEMLERİ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { 
            ...formData, 
            price: parseFloat(formData.price), 
            categoryId: parseInt(formData.categoryId), 
            imageUrls: [formData.imageUrl], 
            allergic: 0 
        };
        
        try {
            if (isEditMode) await productService.update(payload.id, payload);
            else await productService.create(payload);
            
            toast.success(isEditMode ? "Ürün güncellendi." : "Ürün eklendi.");
            setShowModal(false); 
            fetchData();
        } catch (error) { 
            toast.error("İşlem başarısız."); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            try { await productService.remove(id); toast.success("Silindi."); fetchData(); } 
            catch { toast.error("Hata."); }
        }
    };

    const openModal = (item = null) => {
        setIsEditMode(!!item);
        setFormData(item ? {
            id: item.id, name: item.name, description: item.description, price: item.price,
            categoryId: item.categoryId, imageUrl: item.imageUrls?.[0] || ''
        } : {
            id: 0, name: '', description: '', price: '', categoryId: '', imageUrl: ''
        });
        setShowModal(true);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container-fluid p-4">
            
            {/* ÜST BAŞLIK VE BUTON */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Menü Yönetimi</h2>
                    <p className="text-muted">Ürünleri düzenleyin, fiyatları güncelleyin ve görselleri yönetin.</p>
                </div>
                <button className="btn btn-dark px-4 py-2" onClick={() => openModal()}>
                    <i className="fas fa-plus me-2"></i> Yeni Ürün Ekle
                </button>
            </div>

            <div className="row g-4 mb-5">
                {/* GRAFİK ALANI */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-4 fw-bold text-secondary">Kategori Dağılımı</h5>
                            <div style={{ width: '100%', height: 250 }}>
                                <ResponsiveContainer>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip cursor={{fill: '#f8f9fa'}} />
                                        <Bar dataKey="count" name="Ürün Sayısı" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* İSTATİSTİK KARTLARI */}
                <div className="col-lg-4">
                    <div className="row g-3 h-100">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm bg-dark text-white h-100 d-flex flex-column justify-content-center p-4">
                                <h3 className="display-4 fw-bold mb-0">{products.length}</h3>
                                <p className="text-white-50 mb-0">Toplam Ürün</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card border-0 shadow-sm bg-warning bg-opacity-10 p-3 text-center h-100">
                                <h4 className="text-warning fw-bold">{categories.length}</h4>
                                <small className="text-muted">Kategori</small>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card border-0 shadow-sm bg-success bg-opacity-10 p-3 text-center h-100">
                                <h4 className="text-success fw-bold">
                                    {Math.max(...products.map(p => p.price), 0)} ₺
                                </h4>
                                <small className="text-muted">En Pahalı</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FİLTRE BUTONLARI */}
            <div className="d-flex gap-2 overflow-auto mb-4 pb-2">
                <button 
                    className={`btn rounded-pill px-4 ${filterCategory === 'Tümü' ? 'btn-dark' : 'btn-light border'}`}
                    onClick={() => setFilterCategory('Tümü')}
                >
                    Tümü
                </button>
                {categories.map(cat => (
                    <button 
                        key={cat.id}
                        className={`btn rounded-pill px-4 ${filterCategory === cat.name ? 'btn-warning' : 'btn-light border'}`}
                        onClick={() => setFilterCategory(cat.name)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* ÜRÜN KARTLARI (GRID) */}
            <div className="row g-4">
                {filteredProducts.map(product => (
                    <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
                        <div className="card h-100 border-0 shadow-sm product-admin-card">
                            <div className="position-relative">
                                {/*  Ürün Kartı Resmi */}
                                <img 
                                    src={getImageUrl(product.imageUrls?.[0])} 
                                    className="card-img-top" 
                                    alt={product.name}
                                    style={{ height: '200px', objectFit: 'cover' }} 
                                />
                                <span className="position-absolute top-0 end-0 badge bg-white text-dark m-2 shadow-sm">
                                    {product.price} ₺
                                </span>
                                <span className="position-absolute bottom-0 start-0 badge bg-dark m-2">
                                    {product.categoryName || categories.find(c => c.id === product.categoryId)?.name}
                                </span>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title fw-bold text-truncate">{product.name}</h5>
                                <p className="card-text text-muted small text-truncate">{product.description}</p>
                                
                                <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(product)}>
                                        <i className="fas fa-edit me-1"></i> Düzenle
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* EKLEME / DÜZENLEME MODALI */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">{isEditMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold small">Ürün Adı</label>
                                                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                            </div>
                                            <div className="row">
                                                <div className="col-6 mb-3">
                                                    <label className="form-label fw-bold small">Fiyat (₺)</label>
                                                    <input type="number" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <label className="form-label fw-bold small">Kategori</label>
                                                    <select className="form-select" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                                                        <option value="">Seçiniz...</option>
                                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-bold small">Açıklama</label>
                                                <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
                                            </div>
                                        </div>
                                        
                                        {/* GÖRSEL YÜKLEME ALANI */}
                                        <div className="col-md-4">
                                            <label className="form-label fw-bold small">Ürün Görseli</label>
                                            <div className="card bg-light border-dashed text-center p-3 mb-3" style={{border: '2px dashed #ccc'}}>
                                                {formData.imageUrl ? (
                                                    // Modal İçindeki Önizleme Resmi
                                                    <img 
                                                        src={getImageUrl(formData.imageUrl)} 
                                                        alt="Preview" 
                                                        className="img-fluid rounded mb-2" 
                                                        style={{maxHeight: '150px'}} 
                                                    />
                                                ) : (
                                                    <div className="py-4 text-muted">
                                                        <i className="fas fa-image fa-2x mb-2"></i>
                                                        <p className="small mb-0">Görsel Seçilmedi</p>
                                                    </div>
                                                )}
                                                
                                                <input 
                                                    type="file" 
                                                    className="form-control form-control-sm mt-2" 
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    onChange={handleFileChange}
                                                />
                                                <small className="text-muted d-block mt-1" style={{fontSize: '0.7rem'}}>veya URL girin:</small>
                                                <input 
                                                    type="text" 
                                                    className="form-control form-control-sm mt-1" 
                                                    placeholder="https://..." 
                                                    value={formData.imageUrl} 
                                                    onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light border-0">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>İptal</button>
                                    <button type="submit" className="btn btn-dark px-4">{isEditMode ? 'Değişiklikleri Kaydet' : 'Ürünü Oluştur'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}