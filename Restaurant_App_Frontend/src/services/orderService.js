import api from '../api/axiosInstance';

// Kullanıcının kendi siparişlerini getir (Eve Siparişler)
const getMyOrders = async () => {
    const response = await api.get('/Order/my-orders');
    return response.data;
};

// ADMIN: Tüm Online Siparişleri Getir
const getAllOnlineOrders = async () => {
    const response = await api.get('/Order/all');
    return response.data;
};

//Tek bir siparişin detayını getir (İçindeki ürünlerle birlikte)
const getOrderDetails = async (id) => {
    const response = await api.get(`/Order/${id}`);
    return response.data;
};

// Yeni Online Sipariş Oluştur (Eve)
const createOrder = async (orderData) => {
    const response = await api.post('/Order/create', orderData);
    return response.data;
};

// ADMIN: Online Sipariş Durumu Güncelle
const updateOnlineOrderStatus = async (id, statusEnum) => {
    // statusEnum: 0(Waiting), 1(Completed), 2(Canceled), 3(Preparing)
    const response = await api.put(`/Order/update-status/${id}?state=${statusEnum}`);
    return response.data;
};

// ADMIN: Tüm Masa Siparişlerini Getir 
const getAllTableOrders = async () => {
    const response = await api.get('/OrderInRestaurant/all/details');
    return response.data;
};

// ADMIN: Masa Sipariş Durumu Güncelle
const updateTableOrderStatus = async (id, statusString) => {
    // statusString: "Pending", "InProgress", "Served", "Completed"
    const response = await api.put(`/OrderInRestaurant/${id}/status`, { id, status: statusString });
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
    getOrderDetails,
    createTableOrder,
    getAllOnlineOrders,
    updateOnlineOrderStatus,
    getAllTableOrders,
    updateTableOrderStatus
};