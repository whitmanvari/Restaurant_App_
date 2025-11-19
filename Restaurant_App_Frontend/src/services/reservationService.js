import api from '../api/axiosInstance';

const getAll = async () => {
    const response = await api.get('/Reservation');
    return response.data;
};

const getByTable = async (tableId) => {
    const response = await api.get(`/Reservation/table/${tableId}`);
    return response.data;
};

const getMyReservations = async () => {
    const response = await api.get('/Reservation/my-reservations');
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/Reservation', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/Reservation/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/Reservation/${id}`);
    return response.data;
};

export const reservationService = {
    getAll,
    getByTable,
    create,
    update,
    remove,
    getMyReservations
};