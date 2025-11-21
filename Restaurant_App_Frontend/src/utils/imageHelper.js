const DEFAULT_IMAGES = {
    product: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
    restaurant: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2670&auto=format&fit=crop",
    user: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop"
};

export const getImageUrl = (url, type = 'product') => {
    if (!url || url.trim() === "" || url.includes("via.placeholder")) {
        return DEFAULT_IMAGES[type];
    }
    
    // Cloudinary veya başka bir CDN için optimize et
    if (url.includes('cloudinary')) {
        return url.replace('/upload/', '/upload/w_500,h_500,c_fill,q_auto,f_auto/');
    }
    
    return url;
};

// ProductDetailModal.jsx'te kullanım
<img
    src={getImageUrl(product.imageUrls?.[0], 'product')}
    className="img-fluid rounded shadow-sm mb-3"
    style={{ maxHeight: '250px', objectFit: 'cover', width: '100%' }}
    alt={product.name}
    onError={(e) => {
        e.target.src = DEFAULT_IMAGES.product;
    }}
/>