import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchProducts } from "../store/slices/productSlice";
import ProductDetailModal from '../components/ProductDetailModal';

function MenuPage() {
    const dispatch = useDispatch();
    //reduc stateinden hem kategori hem ürünleri okuma
    const { categories, status: categoryStatus } = useSelector((state) => state.categories);
    const { products, status: productStatus } = useSelector((state) => state.products);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeCategory, setActiveCategory] = useState('Tümü');

    useEffect(() => {
        if (categoryStatus === 'idle') {
            dispatch(fetchCategories());
        }
        // Sayfa ilk açıldığında tüm ürünleri getir
        if (productStatus === 'idle') {
            dispatch(fetchProducts());
        }
    }, [categoryStatus, productStatus, dispatch]);

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
        if (categoryName === 'Tümü') {
            dispatch(fetchProducts());
        } else {
            dispatch(fetchProductsByCategory(categoryName));
        }
    };

    if (productStatus === 'loading' || categoryStatus === 'loading') {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-4 mb-5">
            <h2 className="mb-4 text-center" style={{ fontFamily: 'Playfair Display' }}>Menümüz</h2>

            {/* KATEGORİLER */}
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

            {/* ÜRÜNLER */}
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {products.map((product) => (
                    <div className="col" key={product.id}>
                        <div className="card h-100 shadow-sm border-0">
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
                <div className="text-center mt-5 text-muted">
                    Bu kategoride henüz ürün bulunmuyor.
                </div>
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