import api from '../api/axiosInstance';

// Kullanıcının kendi siparişlerini getir (Eve Siparişler)
const getMyOrders = async () => {
    const response = await api.get('/Order/my-orders');
    return response.data;
};

// Yeni Online Sipariş Oluştur (Eve)
const createOrder = async (orderData) => {
    const response = await api.post('/Order/create', orderData);
    return response.data;
};

// Masaya Sipariş Oluştur (Restoran İçi)
const createTableOrder = async (orderData) => {
    const response = await api.post('/OrderInRestaurant/create', orderData);
    return response.data;
};

export const orderService = {
    getMyOrders,
    createOrder,
    createTableOrder
};