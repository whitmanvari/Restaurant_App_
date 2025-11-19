// Varsayılan "Resim Yok" görseli
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop"; 

export const getImageUrl = (url) => {
    if (!url || url.trim() === "" || url.includes("via.placeholder")) {
        return DEFAULT_IMAGE;
    }
    return url;
};

// React img etiketi için onError handler
export const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE;
};