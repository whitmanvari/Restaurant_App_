import React from 'react';

export default function TableDetailModal({ table, activeOrder, onClose, onUpdate }) {
    
    // Eğer aktif sipariş yoksa
    if (!activeOrder) return null;

    // Liste ismini güvenli şekilde al
    const orderItems = activeOrder.orderItemsInRestaurant || activeOrder.orderItems || activeOrder.items || [];

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg">
                    
                    {/* BAŞLIK */}
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title" style={{ fontFamily: 'Playfair Display' }}>
                            Masa {table.tableNumber} - Adisyon Detayı
                        </h5>
                        <button className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    {/* İÇERİK */}
                    <div className="modal-body p-0">
                        
                        {/* 1. SİPARİŞ LİSTESİ TABLOSU */}
                        <div className="table-responsive">
                            <table className="table table-striped table-hover mb-0 align-middle">
                                <thead className="bg-light text-secondary small text-uppercase">
                                    <tr>
                                        <th className="ps-4">Ürün Adı</th>
                                        <th className="text-center">Adet</th>
                                        <th className="text-end">Birim Fiyat</th>
                                        <th className="text-end pe-4">Toplam</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.length > 0 ? (
                                        orderItems.map((item, index) => {
                                            
                                            // --- VERİ OKUMA ---
                                            // 1. İsim Kontrolü
                                            const productName = item.productName || item.product?.name || "Bilinmiyor";
                                            
                                            // 2. Fiyat Kontrolü 
                                            // Backend 'price' gönderiyor mu diye kontrol
                                            const unitPrice = item.price || item.unitPrice || 0; 

                                            // 3. Toplam Kontrolü
                                            const rowTotal = item.quantity * unitPrice;

                                            return (
                                                <tr key={index}>
                                                    <td className="ps-4 fw-bold text-dark">
                                                        {productName}
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-light text-dark border">
                                                            x{item.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="text-end text-muted">
                                                        {Number(unitPrice).toFixed(2)} ₺
                                                    </td>
                                                    <td className="text-end pe-4 fw-bold">
                                                        {rowTotal.toFixed(2)} ₺
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">
                                                <i className="fas fa-box-open fa-2x mb-2 d-block opacity-25"></i>
                                                Siparişe ait ürün detayı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 2. TOPLAM VE BİLGİLER */}
                        <div className="p-4 bg-light border-top">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-2">
                                        <small className="text-muted d-block">Sipariş Tarihi:</small>
                                        <strong>{new Date(activeOrder.orderDate).toLocaleString('tr-TR')}</strong>
                                    </div>
                                    <div>
                                        <small className="text-muted d-block">Sipariş ID:</small>
                                        <span className="text-monospace">#{activeOrder.id}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 text-end">
                                    <h6 className="text-muted text-uppercase mb-1">Genel Toplam</h6>
                                    <h2 className="display-6 fw-bold text-success mb-0">
                                        {activeOrder.totalAmount} ₺
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ALT BUTONLAR */}
                    <div className="modal-footer bg-white">
                        <button className="btn btn-outline-secondary" onClick={onClose}>Kapat</button>
                        <button className="btn btn-primary" onClick={() => window.print()}>
                            <i className="fas fa-print me-2"></i> Yazdır
                        </button>
                        <button className="btn btn-success">
                            <i className="fas fa-check me-2"></i> Hesabı Kapat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}