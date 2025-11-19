import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

function AdminMenuPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form State, ProductDTO yapısına uygun
    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageUrl: '' // Backend List<string> istiyor, bunu gönderirken diziye çevireceğiz
    });

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
            setLoading(false);
        } catch (error) {
            toast.error("Veriler yüklenemedi.");
            setLoading(false);
        }
    };

    // Form İşlemleri
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const openAddModal = () => {
        setFormData({ id: 0, name: '', description: '', price: '', categoryId: categories[0]?.id || '', imageUrl: '' });
        setIsEditMode(false);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setFormData({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
            imageUrl: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : ''
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Backend ProductDTO List<string> ImageUrls bekliyor.
        // Biz formdan tek url alıp listeye çeviriyoruz.
        const payload = {
            id: formData.id,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price), // Decimal için number'a çevir
            categoryId: parseInt(formData.categoryId),
            imageUrls: [formData.imageUrl],
            allergic: 0 // Varsayılan 0
        };

        try {
            if (isEditMode) {
                await productService.update(payload.id, payload);
                toast.success("Ürün güncellendi.");
            } else {
                await productService.create(payload);
                toast.success("Yeni ürün eklendi.");
            }
            setShowModal(false);
            fetchData(); // Listeyi yenile
        } catch (error) {
            console.error(error);
            toast.error("İşlem başarısız. Lütfen değerleri kontrol edin.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            try {
                await productService.remove(id);
                toast.success("Ürün silindi.");
                fetchData();
            } catch (error) {
                toast.error("Silme işlemi başarısız.");
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'Playfair Display' }}>Menü Yönetimi</h2>
                <button className="btn btn-dark" onClick={openAddModal}>
                    <i className="fas fa-plus me-2"></i> Yeni Ürün Ekle
                </button>
            </div>

            {/* ÜRÜN TABLOSU */}
            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '80px' }}>Görsel</th>
                                <th>Ürün Adı</th>
                                <th>Kategori</th>
                                <th>Fiyat</th>
                                <th className="text-end">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <img
                                            src={product.imageUrls?.[0] || "https://via.placeholder.com/50"}
                                            alt={product.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </td>
                                    <td>
                                        <div className="fw-bold">{product.name}</div>
                                        <small className="text-muted">{product.description.substring(0, 30)}...</small>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {product.categoryName || categories.find(c => c.id === product.categoryId)?.name}
                                        </span>
                                    </td>
                                    <td className="fw-bold text-success">{product.price} ₺</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(product)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BASİT MODAL (Bootstrap Classları ile) */}
            {showModal && (
                <>
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{isEditMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Ürün Adı</label>
                                            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Açıklama</label>
                                            <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={handleInputChange} required></textarea>
                                        </div>
                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <label className="form-label">Fiyat (₺)</label>
                                                <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label">Kategori</label>
                                                <select className="form-select" name="categoryId" value={formData.categoryId} onChange={handleInputChange} required>
                                                    <option value="">Seçiniz...</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Resim URL</label>
                                            <input type="text" className="form-control" name="imageUrl" placeholder="https://..." value={formData.imageUrl} onChange={handleInputChange} required />
                                            {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-2 rounded" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                                        <button type="submit" className="btn btn-dark">{isEditMode ? 'Güncelle' : 'Kaydet'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminMenuPage;