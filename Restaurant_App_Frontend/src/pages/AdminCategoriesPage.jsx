import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { categoryService } from '../services/categoryService';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: 0, name: '', description: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
            setLoading(false);
        } catch (error) { toast.error("Kategoriler yüklenemedi."); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) await categoryService.update(formData.id, formData);
            else await categoryService.create(formData);
            toast.success("İşlem başarılı.");
            setShowModal(false);
            fetchData();
        } catch (error) { toast.error("Kaydetme başarısız."); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
        try { await categoryService.remove(id); toast.success("Silindi."); fetchData(); } 
        catch { toast.error("Silinemedi."); }
    };

    const openModal = (item = null) => {
        setIsEditMode(!!item);
        setFormData(item || { id: 0, name: '', description: '' });
        setShowModal(true);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    return (
        <div className="container mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'Playfair Display' }}>Kategori Yönetimi</h2>
                <button className="btn btn-dark" onClick={() => openModal()}><i className="fas fa-plus me-2"></i> Yeni Kategori</button>
            </div>
            <div className="card shadow-sm border-0"><div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light"><tr><th className="ps-4">Ad</th><th>Açıklama</th><th className="text-end pe-4">İşlem</th></tr></thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id}>
                                <td className="ps-4 fw-bold">{cat.name}</td>
                                <td className="text-muted">{cat.description}</td>
                                <td className="text-end pe-4">
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(cat)}><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div></div>
            
            {showModal && (
                <div className="modal fade show d-block" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header"><h5 className="modal-title">{isEditMode ? 'Düzenle' : 'Ekle'}</h5><button className="btn-close" onClick={() => setShowModal(false)}></button></div>
                            <form onSubmit={handleSubmit}><div className="modal-body">
                                <div className="mb-3"><label>Ad</label><input className="form-control" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required/></div>
                                <div className="mb-3"><label>Açıklama</label><input className="form-control" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})}/></div>
                            </div><div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button><button type="submit" className="btn btn-dark">Kaydet</button></div></form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}