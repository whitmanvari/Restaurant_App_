import api from '../api/axiosInstance';

// Tüm ürünleri getir
const getAll = async () => {
    const response = await api.get('/Product/GetAll');
    return response.data;
};

// Kategoriye göre getir
const getByCategory = async (categoryName) => {
    const response = await api.get(`/Product/ByCategory?category=${categoryName}`);
    return response.data;
};

// Yeni ürün ekle
const create = async (productData) => {
    const response = await api.post('/Product/Create', productData);
    return response.data;
};

// Ürün güncelle
const update = async (id, productData) => {
    const response = await api.put(`/Product/Update/${id}`, productData);
    return response.data;
};

// Ürün sil
const remove = async (id) => {
    const response = await api.delete(`/Product/Delete/${id}`);
    return response.data;
};
// params: { pageNumber, pageSize, searchTerm, category }
const getProductsByFilter = async (params) => {
    // Axios params objesini query string'e çevirir (?pageNumber=1&searchTerm=abc...)
    const response = await api.get('/Product/filter', { params });
    return response.data;
};

export const productService = {
    getAll,
    getByCategory,
    create, 
    update, 
    remove,
    getProductsByFilter
};