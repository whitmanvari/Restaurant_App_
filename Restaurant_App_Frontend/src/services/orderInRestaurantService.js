import api from '../api/axiosInstance';

// Sipariş Detayını Getir
const getOrderDetails = async (orderId) => {
    const response = await api.get(`/OrderInRestaurant/${orderId}/details`);
    return response.data;
};

// Mevcut Siparişe Ürün Ekle
const addOrderItem = async (orderId, productData) => {
    // productData: { productId, quantity, price }
    const response = await api.post(`/OrderInRestaurant/${orderId}/additem`, productData);
    return response.data;
};

// Siparişten Ürün Sil
const removeOrderItem = async (orderId, itemId) => {
    const response = await api.delete(`/OrderInRestaurant/${orderId}/removeitem/${itemId}`);
    return response.data;
};

// Siparişi/Masayı Kapat (Completed yap)
const closeOrder = async (orderId) => {
    // Status enum: 3 = Completed
    const response = await api.put(`/OrderInRestaurant/${orderId}/status`, { 
        id: orderId, 
        status: 'Completed' 
    });
    return response.data;
};

export const orderInRestaurantService = {
    getOrderDetails,
    addOrderItem,
    removeOrderItem,
    closeOrder
};