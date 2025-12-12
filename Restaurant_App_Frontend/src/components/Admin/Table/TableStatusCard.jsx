import React from 'react';

export default function TableStatusCard({ table, statusObj, onClick, onEdit, onDelete, style }) {
    
    // RENK AYARLARI
    const getHeaderColor = () => {
        switch (statusObj.status) {
            case 'occupied': return 'bg-danger text-white';
            case 'reserved': return 'bg-info text-white';
            case 'future': return 'text-white'; // Rengi style'dan veya özel sınıftan alacak (Admin Tables Page)
            case 'empty': return 'bg-success text-white';
            case 'closed': return 'bg-secondary text-white';
            default: return 'bg-light text-dark';
        }
    };

    // Gelecek rezervasyon için özel başlık stili
    const headerStyle = statusObj.status === 'future' 
        ? { backgroundColor: statusObj.customColor || '#6f42c1' } 
        : {};

    return (
        <div 
            className="card h-100 border-0 shadow-sm position-relative"
            style={{ 
                cursor: 'pointer', 
                transition: 'transform 0.2s', 
                ...style // Dışarıdan gelen stili (Mor çizgi vb.) buraya ekledik
            }}
            onClick={() => onClick(table, statusObj)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* Kart Başlığı (Masa No) */}
            <div className={`card-header d-flex justify-content-between align-items-center ${getHeaderColor()}`} style={headerStyle}>
                <h5 className="mb-0 fw-bold">{table.tableNumber}</h5>
                <i className={`fas ${statusObj.icon || 'fa-chair'}`}></i>
            </div>

            {/* Kart İçeriği */}
            <div className="card-body text-center d-flex flex-column justify-content-center py-4">
                <h6 className="card-title text-uppercase fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
                    {statusObj.text}
                </h6>
                <p className="card-text text-muted mb-0 small">
                    {statusObj.subText}
                </p>
            </div>

            {/* Aksiyon Butonları */}
            <div className="card-footer bg-white border-0 d-flex justify-content-between">
                <button 
                    className="btn btn-sm btn-outline-primary rounded-circle" 
                    onClick={(e) => { e.stopPropagation(); onEdit(table); }}
                    title="Düzenle"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                >
                    <i className="fas fa-edit small"></i>
                </button>
                <button 
                    className="btn btn-sm btn-outline-danger rounded-circle" 
                    onClick={(e) => { e.stopPropagation(); onDelete(table.id); }}
                    title="Sil"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                >
                    <i className="fas fa-trash-alt small"></i>
                </button>
            </div>
        </div>
    );
}