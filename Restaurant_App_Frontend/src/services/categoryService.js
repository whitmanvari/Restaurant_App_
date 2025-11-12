import api from '../api/axiosInstance';

//get all categories
const getAll = async() => {
    try{
        const response = await api.get('/Category/getall');
        return response.data; // dto listesini döndür
    } catch(error) {
        return Promise.reject(error.response.data);
    }
};

//tüm category fonksiyonları tek bir nesne olarak export olsun
export const categoryService = {
    getAll,
}