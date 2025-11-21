const DEFAULT_IMAGES = {
    product: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
    restaurant: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2670&auto=format&fit=crop",
    user: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop"
};

export const getImageUrl = (url, type = 'product') => {
    if (!url || url.trim() === "" || url?.includes("via.placeholder")) {
        return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.product;
    }

    if (url.includes('cloudinary')) {
        return url.replace('/upload/', '/upload/w_500,h_500,c_fill,q_auto,f_auto/');
    }

    return url;
};