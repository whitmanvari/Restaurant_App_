import api from '../api/axiosInstance';

//get all products
const getAll = async() => {
    try{
        const response = await api.get('/Product/GetAll');
        return response.data; //dto list
    }
    catch(error){
        return Promise.reject(error.response.data);
    }
}
//get products by category (menüdeki filtreleme işi)
const getByCategory = async(categoryName) => {
    try{
        const response = await api.get(`/Product/ByCategory?category=${categoryName}`);
        return response.data;
    } 
    catch(error) {
        return Promise.reject(error.response.data);
    }
}

export const productService = {
    getAll,
    getByCategory
}