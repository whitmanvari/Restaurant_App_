import defaultImage from '../assets/images/default-food.jpg'; // Varsayılan resim yolu

export const getImageUrl = (url) => {
    // 1. URL hiç yoksa veya boşsa -> Default
    if (!url || url === "" || url === "string") {
        return defaultImage;
    }

    // 2. URL zaten tam bir web adresi ise (http/https) 
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // 3. URL bir Base64 string ise (data:image/...) 
    if (url.startsWith('data:image')) {
        return url;
    }

    // 4. URL yerel bir dosya yolu ise (backend'den gelen /uploads/...)
    // Backend adresini başına ekle (localhost:7254)
    const BASE_URL = "https://localhost:7254"; 
    
    // Eğer başında / yoksa ekle
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    return `${BASE_URL}${cleanUrl}`;
};