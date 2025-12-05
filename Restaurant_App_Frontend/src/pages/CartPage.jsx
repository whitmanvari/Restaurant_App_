import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeProductFromCart, updateCartItemQuantity } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';

function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, totalAmount, status } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleQuantityChange = (productId, currentQty, change) => {
        const newQty = currentQty + change;
        if (newQty < 1) return;
        dispatch(updateCartItemQuantity({ productId, quantity: newQty }));
    };

    const handleRemoveItem = (productId) => {
        if (window.confirm("Ürünü sepetten çıkarmak istiyor musunuz?")) {
            dispatch(removeProductFromCart(productId));
            toast.info("Ürün çıkarıldı.");
        }
    };

    if (status === 'loading') return <div className="text-center mt-5 pt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-5 mb-5">
            <h2 className="mb-4 text-center" style={{ fontFamily: 'Playfair Display' }}>Alışveriş Sepetim</h2>

            {items.length === 0 ? (
                <div className="text-center py-5 bg-light rounded">
                    <i className="fas fa-shopping-basket fa-4x text-muted mb-3 opacity-25"></i>
                    <h4>Sepetiniz Boş</h4>
                    <p className="text-muted">Lezzetli menümüze göz atmak ister misiniz?</p>
                    <Link to="/menu" className="btn btn-dark mt-3 px-4">Menüyü İncele</Link>
                </div>
            ) : (
                <>
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4 py-3">Ürün</th>
                                        <th className="text-center">Birim Fiyat</th>
                                        <th className="text-center">Adet</th>
                                        <th className="text-end pe-4">Toplam</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => (
                                        <tr key={item.productId}>
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <img 
                                                        src={getImageUrl(item.imageUrl)} 
                                                        alt={item.productName} 
                                                        className="rounded"
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                                                    />
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">{item.productName}</h6>
                                                        <small className="text-muted">Kategori: Lezzetler</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center text-muted">{item.price} ₺</td>
                                            <td className="text-center">
                                                <div className="btn-group btn-group-sm border rounded">
                                                    <button className="btn btn-light px-2" onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}>-</button>
                                                    <button className="btn btn-white fw-bold px-3" disabled>{item.quantity}</button>
                                                    <button className="btn btn-light px-2" onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}>+</button>
                                                </div>
                                            </td>
                                            <td className="text-end pe-4 fw-bold fs-5 text-dark">{item.totalPrice} ₺</td>
                                            <td className="text-end pe-3">
                                                <button className="btn btn-link text-danger p-0" onClick={() => handleRemoveItem(item.productId)}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-4 bg-light rounded border">
                        <Link to="/menu" className="text-decoration-none text-dark fw-bold">
                            <i className="fas fa-arrow-left me-2"></i> Alışverişe Devam Et
                        </Link>
                        
                        <div className="text-end d-flex align-items-center gap-4">
                            <div>
                                <span className="text-muted d-block small">Genel Toplam</span>
                                <span className="fs-2 fw-bold text-success">{totalAmount} ₺</span>
                            </div>
                            
                            <button 
                                onClick={() => navigate('/checkout')} 
                                className="btn btn-dark btn-lg px-5 py-3 text-uppercase fw-bold"
                                style={{ letterSpacing: '1px' }}
                            >
                                Sepeti Onayla <i className="fas fa-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;