import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchProductsByFilter, setPageNumber } from "../store/slices/productSlice"; // YENİ IMPORTLAR
import ProductDetailModal from '../components/ProductDetailModal';

function MenuPage() {
    const dispatch = useDispatch();

    // State verilerini al
    const { categories } = useSelector((state) => state.categories);
    const { products, pagination, status } = useSelector((state) => state.products);

    // Local UI State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeCategory, setActiveCategory] = useState('Tümü');
    const [searchTerm, setSearchTerm] = useState('');

    // 1. İlk Yükleme ve Parametre Değişiminde Tetikleme
    useEffect(() => {
        // Kategoriler yüklü değilse yükle
        if (categories.length === 0) {
            dispatch(fetchCategories());
        }

        // Filtre Parametrelerini Hazırla
        const params = {
            pageNumber: pagination.pageNumber,
            pageSize: 6, // Her sayfada 6 ürün
            searchTerm: searchTerm,
            category: activeCategory === 'Tümü' ? null : activeCategory
        };

        // İsteği At
        dispatch(fetchProductsByFilter(params));

    }, [dispatch, pagination.pageNumber, activeCategory, searchTerm]); // Bu değerler değişince useEffect çalışır

    // Kategori Değişimi
    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
        dispatch(setPageNumber(1)); // Kategori değişince 1. sayfaya dön
    };

    // Arama Değişimi
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        dispatch(setPageNumber(1)); // Arama yapınca 1. sayfaya dön
    };

    // Sayfa Değişimi
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            dispatch(setPageNumber(newPage));
            window.scrollTo(0, 0); // Sayfa değişince yukarı kaydır
        }
    };

    return (
        <div className="container mt-5 pt-4 mb-5">
            <h2 className="mb-4 text-center" style={{ fontFamily: 'Playfair Display' }}>Menümüz</h2>

            {/* --- ARAMA ÇUBUĞU --- */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="fas fa-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Menüde ara (Örn: Burger, Makarna...)"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </div>

            {/* --- KATEGORİLER --- */}
            <div className="d-flex justify-content-center mb-5 overflow-auto">
                <div className="btn-group">
                    <button
                        type="button"
                        className={`btn ${activeCategory === 'Tümü' ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => handleCategoryClick('Tümü')}
                    >
                        Tümü
                    </button>
                    {categories.map((category) => (
                        <button
                            type="button"
                            key={category.id}
                            className={`btn ${activeCategory === category.name ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- LOADING DURUMU --- */}
            {status === 'loading' ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '40vh' }}>
                    <div className="spinner-border text-warning" role="status"></div>
                </div>
            ) : (
                <>
                    {/* --- ÜRÜNLER LİSTESİ --- */}
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {products.map((product) => (
                            <div className="col" key={product.id}>
                                <div className="card h-100 shadow-sm border-0 fade-in-up">
                                    <img
                                        src={product.imageUrls?.[0] || 'https://via.placeholder.com/300x200?text=Resim+Yok'}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: '250px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ fontFamily: 'Playfair Display' }}>{product.name}</h5>
                                        <p className="card-text text-muted small">
                                            {product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description}
                                        </p>
                                    </div>
                                    <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center pb-3">
                                        <span className="text-success fw-bold fs-5">{product.price} ₺</span>
                                        <button
                                            className="btn btn-outline-dark btn-sm px-3"
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            İncele
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center mt-5 text-muted p-5 bg-light rounded">
                            <i className="fas fa-search fa-3x mb-3 opacity-50"></i>
                            <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
                        </div>
                    )}

                    {/* PAGINATION (SAYFALAMA)  */}
                    {pagination.totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-5">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${pagination.pageNumber === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link text-dark" onClick={() => handlePageChange(pagination.pageNumber - 1)}>
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                    </li>

                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <li key={i} className={`page-item ${pagination.pageNumber === i + 1 ? 'active' : ''}`}>
                                            <button
                                                className={`page-link ${pagination.pageNumber === i + 1 ? 'bg-dark border-dark text-white' : 'text-dark'}`}
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${pagination.pageNumber === pagination.totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link text-dark" onClick={() => handlePageChange(pagination.pageNumber + 1)}>
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </>
            )}

            {/* ÜRÜN DETAY MODALI */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}

export default MenuPage;