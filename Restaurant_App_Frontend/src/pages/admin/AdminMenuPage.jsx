import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

function AdminMenuPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: 0, name: '', description: '', price: '', categoryId: '', imageUrl: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [prodData, catData] = await Promise.all([productService.getAll(), categoryService.getAll()]);
            setProducts(prodData);
            setCategories(catData);
            setLoading(false);
        } catch (error) { toast.error("Veriler yüklenemedi."); setLoading(false); }
    };

    const openAddModal = () => {
        setFormData({ id: 0, name: '', description: '', price: '', categoryId: categories[0]?.id || '', imageUrl: '' });
        setIsEditMode(false); setShowModal(true);
    };

    const openEditModal = (product) => {
        setFormData({
            id: product.id, name: product.name, description: product.description, price: product.price,
            categoryId: product.categoryId, imageUrl: product.imageUrls?.[0] || ''
        });
        setIsEditMode(true); setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, price: parseFloat(formData.price), categoryId: parseInt(formData.categoryId), imageUrls: [formData.imageUrl], allergic: 0 };
        try {
            isEditMode ? await productService.update(payload.id, payload) : await productService.create(payload);
            toast.success(isEditMode ? "Güncellendi" : "Eklendi");
            setShowModal(false); fetchData();
        } catch (error) { toast.error("İşlem başarısız."); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Silmek istediğinize emin misiniz?")) {
            try { await productService.remove(id); toast.success("Silindi."); fetchData(); } catch { toast.error("Hata."); }
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>Menü Yönetimi</h2>
                <button className="btn btn-dark" onClick={openAddModal}><i className="fas fa-plus me-2"></i> Yeni Ürün</button>
            </div>

            <div className="card border-0 shadow-sm" style={{backgroundColor: 'var(--bg-card)'}}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{color: 'var(--text-main)'}}>
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Görsel</th>
                                <th>Ürün</th>
                                <th>Kategori</th>
                                <th>Fiyat</th>
                                <th className="text-end pe-4">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                                    <td className="ps-4">
                                        <img src={product.imageUrls?.[0] || "https://via.placeholder.com/50"} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                                    </td>
                                    <td>
                                        <div className="fw-bold">{product.name}</div>
                                        <small className="text-muted">{product.description.substring(0, 30)}...</small>
                                    </td>
                                    <td><span className="badge bg-light text-dark border">{product.categoryName || categories.find(c => c.id === product.categoryId)?.name}</span></td>
                                    <td className="fw-bold text-success">{product.price} ₺</td>
                                    <td className="text-end pe-4">
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(product)}><i className="fas fa-edit"></i></button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditMode ? 'Düzenle' : 'Yeni Ekle'}</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3"><label>Ürün Adı</label><input type="text" className="form-control" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                                    <div className="mb-3"><label>Açıklama</label><textarea className="form-control" rows="2" name="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea></div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-6"><label>Fiyat</label><input type="number" className="form-control" name="price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required /></div>
                                        <div className="col-6"><label>Kategori</label><select className="form-select" name="categoryId" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required><option value="">Seçiniz...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                    </div>
                                    <div className="mb-3"><label>Resim URL</label><input type="text" className="form-control" name="imageUrl" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required /></div>
                                </div>
                                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button><button type="submit" className="btn btn-dark">Kaydet</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default AdminMenuPage;