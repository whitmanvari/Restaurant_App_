import api from '../api/axiosInstance';

const getAll = async () => {
    const response = await api.get('/User/GetAll');
    return response.data;
};

const update = async (id, userData) => {
    const response = await api.put(`/User/Update/${id}`, userData);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/User/Delete/${id}`);
    return response.data;
};

export const userService = {
    getAll,
    update,
    remove
};