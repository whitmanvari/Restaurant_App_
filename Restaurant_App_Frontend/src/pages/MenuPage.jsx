import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchProductsByFilter, setPageNumber } from "../store/slices/productSlice";
import { Allergens } from '../constants/allergens';
import { getImageUrl } from '../utils/imageHelper';
import { Link } from 'react-router-dom'; 

function MenuPage() {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.categories);
    const { products, pagination, status } = useSelector((state) => state.products);

    const [activeCategory, setActiveCategory] = useState('Tümü');
    const [searchTerm, setSearchTerm] = useState('');
    const [excludedAllergensMask, setExcludedAllergensMask] = useState(0);

    useEffect(() => {
        if (categories.length === 0) dispatch(fetchCategories());
    }, [dispatch, categories.length]);

    useEffect(() => {
        const params = {
            pageNumber: pagination.pageNumber,
            pageSize: 9,
            searchTerm,
            category: activeCategory === 'Tümü' ? null : activeCategory,
            excludeAllergens: excludedAllergensMask
        };
        dispatch(fetchProductsByFilter(params));
    }, [dispatch, pagination.pageNumber, activeCategory, searchTerm, excludedAllergensMask]);

    const handleCategoryClick = (catName) => {
        setActiveCategory(catName);
        dispatch(setPageNumber(1));
    };

    const handleAllergenChange = (id) => {
        setExcludedAllergensMask(prev => prev ^ id);
        dispatch(setPageNumber(1));
    };

    return (
        <div className="menu-page-wrapper" style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '100px',
            paddingBottom: '60px',
            transition: 'background-color 0.3s ease'
        }}>
            <div className="container">
                
                {/* Header */}
                <div className="text-center mb-5">
                    <h2 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', color: 'var(--text-main)' }}>Menümüz</h2>
                    <p className="text-muted">Özenle hazırlanan lezzetlerimizi keşfedin</p>
                </div>

                <div className="row g-5">
                    
                    {/* --- SOL PANEL: FİLTRELER --- */}
                    <div className="col-lg-3">
                        <div className="filter-sidebar p-4 rounded shadow-sm sticky-top" style={{ top: '100px', zIndex: 900, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            
                            {/* Arama */}
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase ls-1" style={{ color: 'var(--text-main)' }}>Arama</label>
                                <div className="input-group">
                                    <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}>
                                        <i className="fas fa-search text-muted"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        className="form-control border-start-0" 
                                        placeholder="Ürün ara..." 
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); dispatch(setPageNumber(1)); }}
                                    />
                                </div>
                            </div>

                            {/* Kategoriler */}
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase ls-1" style={{ color: 'var(--text-main)' }}>Kategoriler</label>
                                <ul className="list-group list-group-flush">
                                    <li 
                                        className={`list-group-item d-flex justify-content-between align-items-center cursor-pointer ${activeCategory === 'Tümü' ? 'active-cat' : ''}`}
                                        onClick={() => handleCategoryClick('Tümü')}
                                        style={{ 
                                            backgroundColor: 'transparent',
                                            borderBottom: '1px solid var(--border-color)',
                                            padding: '10px 0', 
                                            fontWeight: activeCategory === 'Tümü' ? 'bold' : 'normal', 
                                            color: activeCategory === 'Tümü' ? 'var(--accent-color)' : 'var(--text-main)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <span>Tümü</span>
                                        {activeCategory === 'Tümü' && <i className="fas fa-chevron-right small opacity-50"></i>}
                                    </li>
                                    {categories.map(cat => (
                                        <li 
                                            key={cat.id}
                                            className={`list-group-item d-flex justify-content-between align-items-center cursor-pointer ${activeCategory === cat.name ? 'active-cat' : ''}`}
                                            onClick={() => handleCategoryClick(cat.name)}
                                            style={{ 
                                                backgroundColor: 'transparent',
                                                borderBottom: '1px solid var(--border-color)',
                                                padding: '10px 0', 
                                                fontWeight: activeCategory === cat.name ? 'bold' : 'normal', 
                                                color: activeCategory === cat.name ? 'var(--accent-color)' : 'var(--text-main)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span>{cat.name}</span>
                                            {activeCategory === cat.name && <i className="fas fa-chevron-right small text-warning"></i>}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Alerjenler */}
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase ls-1 text-danger">Alerjen Filtresi</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {Allergens.map(allergen => {
                                        const isSelected = (excludedAllergensMask & allergen.id) === allergen.id;
                                        return (
                                            <button 
                                                key={allergen.id}
                                                className={`btn btn-sm ${isSelected ? 'btn-danger text-white' : 'btn-outline-secondary text-muted border'}`}
                                                onClick={() => handleAllergenChange(allergen.id)}
                                                style={{ fontSize: '0.8rem', backgroundColor: isSelected ? '#dc3545' : 'transparent', borderColor: isSelected ? '#dc3545' : 'var(--border-color)' }}
                                            >
                                                <i className={`${allergen.icon} me-1`}></i>
                                                {allergen.label}
                                                {isSelected && <i className="fas fa-times ms-2"></i>}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- SAĞ PANEL: ÜRÜNLER --- */}
                    <div className="col-lg-9">
                        {status === 'loading' ? (
                            <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-5 rounded shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
                                <i className="fas fa-utensils fa-3x text-muted mb-3 opacity-25"></i>
                                <h5 style={{ color: 'var(--text-main)' }}>Üzgünüz, sonuç bulunamadı.</h5>
                                <p className="text-muted">Lütfen filtreleri değiştirip tekrar deneyin.</p>
                            </div>
                        ) : (
                            <>
                                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                                    {products.map(product => (
                                        <div className="col" key={product.id}>
                                            <div 
                                                className="card h-100 border-0 shadow-sm product-hover-card"
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    overflow: 'hidden', 
                                                    transition: 'all 0.3s',
                                                    backgroundColor: 'var(--bg-card)'
                                                }}
                                            >
                                                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                                    <img 
                                                        src={getImageUrl(product.imageUrls?.[0])} 
                                                        className="card-img-top w-100 h-100" 
                                                        style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                                                        alt={product.name}
                                                    />
                                                    <span className="position-absolute top-0 end-0 bg-white px-3 py-1 m-2 rounded shadow-sm fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                                                        {product.price} ₺
                                                    </span>
                                                </div>
                                                <div className="card-body text-center p-4">
                                                    <h5 className="card-title mb-2" style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)' }}>{product.name}</h5>
                                                    
                                                    {/* YILDIZLAR VE DEBUG LOG */}
                                                    {/* Burası konsola ürünün puanını yazacak, F12'den kontrol et */}
                                                    {console.log(`Ürün: ${product.name}, Puan: ${product.averageRating}`)}
                                                    
                                                    <div className="text-warning small mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i key={i} className={`fas fa-star ${i < Math.round(product.averageRating || 0) ? '' : 'text-muted opacity-25'}`}></i>
                                                        ))}
                                                    </div>

                                                    <p className="card-text text-muted small">
                                                        {product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}
                                                    </p>
                                                    
                                                    {/* DETAY SAYFASI LİNKİ */}
                                                    <Link to={`/product/${product.id}`} className="btn btn-sm btn-outline-dark mt-2 text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
                                                        İncele
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="d-flex justify-content-center mt-5">
                                        <nav>
                                            <ul className="pagination">
                                                <li className={`page-item ${pagination.pageNumber === 1 ? 'disabled' : ''}`}>
                                                    <button className="page-link border-0 bg-transparent" style={{ color: 'var(--text-main)' }} onClick={() => dispatch(setPageNumber(pagination.pageNumber - 1))}>
                                                        <i className="fas fa-chevron-left"></i>
                                                    </button>
                                                </li>
                                                {[...Array(pagination.totalPages)].map((_, i) => (
                                                    <li key={i} className="page-item">
                                                        <button 
                                                            className={`page-link border-0 rounded-circle mx-1`}
                                                            style={{ 
                                                                width: '40px', height: '40px',
                                                                backgroundColor: pagination.pageNumber === i + 1 ? 'var(--text-main)' : 'var(--bg-card)',
                                                                color: pagination.pageNumber === i + 1 ? 'var(--bg-body)' : 'var(--text-main)'
                                                            }}
                                                            onClick={() => dispatch(setPageNumber(i + 1))}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${pagination.pageNumber === pagination.totalPages ? 'disabled' : ''}`}>
                                                    <button className="page-link border-0 bg-transparent" style={{ color: 'var(--text-main)' }} onClick={() => dispatch(setPageNumber(pagination.pageNumber + 1))}>
                                                        <i className="fas fa-chevron-right"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuPage;