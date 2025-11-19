import api from '../api/axiosInstance';

const getAll = async () => {
    const response = await api.get('/Table');
    return response.data;
};

const getAllWithDetails = async () => {
    const response = await api.get('/Table/details');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/Table/${id}`);
    return response.data;
};

const create = async (tableData) => {
    // tableData: { tableNumber: "A1", capacity: 4 }
    const response = await api.post('/Table/create', tableData);
    return response.data;
};

const update = async (id, tableData) => {
    const response = await api.put(`/Table/update/${id}`, tableData);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/Table/delete/${id}`);
    return response.data;
};

export const tableService = {
    getAll,
    getAllWithDetails,
    getById,
    create,
    update,
    remove
};