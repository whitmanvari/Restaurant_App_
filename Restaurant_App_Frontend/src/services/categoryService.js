import api from '../api/axiosInstance';

const getAll = async() => {
    const response = await api.get('/Category/getall');
    return response.data;
};

const getById = async(id) => {
    const response = await api.get(`/Category/${id}`);
    return response.data;
};

const create = async(categoryData) => {
    const response = await api.post('/Category/create', categoryData);
    return response.data;
};

const update = async(id, categoryData) => {
    const response = await api.put(`/Category/update/${id}`, categoryData);
    return response.data;
};

const remove = async(id) => {
    const response = await api.delete(`/Category/delete/${id}`);
    return response.data;
};

export const categoryService = {
    getAll,
    getById,
    create,
    update,
    remove
};