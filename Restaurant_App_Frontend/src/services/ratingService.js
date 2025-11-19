import api from '../api/axiosInstance';

// Ürünün ortalamasını getir
const getAverage = async (productId) => {
    const response = await api.get(`/Rating/product/${productId}/average`);
    return response.data; // { productId, averageRating } döner
};

export const ratingService = {
    getAverage
};