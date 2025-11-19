import api from '../api/axiosInstance';

// Bir ürünün yorumlarını getir (Puanlarla birlikte)
const getByProduct = async (productId) => {
    const response = await api.get(`/Comment/ByProduct/${productId}`);
    return response.data;
};

// Yeni yorum ve puan ekle
const create = async (commentData) => {
    // commentData: { text, productId, ratingValue }
    const response = await api.post('/Comment/create', commentData);
    return response.data;
};

// Yorum sil (Kendi yorumuysa)
const remove = async (id) => {
    const response = await api.delete(`/Comment/Delete/${id}`);
    return response.data;
};

export const commentService = {
    getByProduct,
    create,
    remove
};