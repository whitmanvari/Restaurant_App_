import React from 'react';

export default function TableStatusCard({ table, statusObj, onClick, onEdit, onDelete }) {
    const { color, text, subText, icon, status } = statusObj;

    return (
        <div className="col-6 col-md-4 col-lg-3 col-xl-2">
            <div 
                className={`card h-100 shadow-sm border-0 position-relative`}
                style={{ 
                    transition: 'all 0.3s', 
                    backgroundColor: !table.isAvailable ? '#f8f9fa' : 'var(--bg-card)',
                    border: `1px solid ${status === 'occupied' ? '#dc3545' : 'var(--border-color)'}`,
                    cursor: 'pointer'
                }}
                onClick={() => onClick(table, statusObj)}
            >
                {/* Durum Çubuğu (Üst) */}
                <div className={`position-absolute top-0 start-0 w-100 rounded-top`} style={{ height: '6px', backgroundColor: status === 'closed' ? '#6c757d' : (status==='occupied' ? '#dc3545' : (status==='reserved' ? '#0dcaf0' : '#198754')) }}></div>

                {/* Edit/Delete Butonları (Sağ Üst) */}
                <div className="position-absolute top-0 end-0 m-2 d-flex gap-1" style={{zIndex: 5}}>
                    <button className="btn btn-sm btn-light border rounded-circle shadow-sm py-0 px-1" onClick={(e) => { e.stopPropagation(); onEdit(table); }} title="Düzenle">
                        <i className="fas fa-pen text-primary" style={{fontSize:'0.7rem'}}></i>
                    </button>
                    <button className="btn btn-sm btn-light border rounded-circle shadow-sm py-0 px-1 text-danger" onClick={(e) => { e.stopPropagation(); onDelete(table.id); }} title="Sil">
                        <i className="fas fa-times" style={{fontSize:'0.7rem'}}></i>
                    </button>
                </div>

                {/* Kart İçeriği */}
                <div className="card-body text-center p-3 d-flex flex-column justify-content-center" style={{ opacity: !table.isAvailable ? 0.6 : 1 }}>
                    <div className={`mb-2 text-${color}`}>
                        <i className={`fas ${icon} fa-2x`}></i>
                    </div>
                    
                    <h5 className="fw-bold mb-0" style={{color:'var(--text-main)'}}>{table.tableNumber}</h5>
                    
                    <div className={`badge bg-${color} bg-opacity-10 text-${color} my-2`}>
                        {text}
                    </div>
                    
                    <small className="text-muted" style={{fontSize:'0.75rem'}}>
                        {subText}
                    </small>
                </div>
            </div>
        </div>
    );
}