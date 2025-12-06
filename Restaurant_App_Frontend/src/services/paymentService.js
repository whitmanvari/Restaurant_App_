import api from '../api/axiosInstance';

// Ödeme İsteği Gönderen Fonksiyon
const processPayment = async (paymentData) => {
    // Backend: PaymentController -> ProcessPayment
    const response = await api.post('/Payment/process', paymentData);
    return response.data;
};

export const paymentService = {
    processPayment
};