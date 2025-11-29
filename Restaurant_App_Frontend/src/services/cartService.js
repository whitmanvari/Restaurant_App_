import api from "../api/axiosInstance";

//get cart
const getCart = async() => {
    try{
        const response = await api.get('/Cart');
        return response.data;
    } 
    catch(error) {
        return Promise.reject(error.response.data);
    }
}

//add to cart
const addToCart = async(productId, quantity) => {
    try{
        const response = await api.post('/Cart/add', {productId, quantity});
        return response.data;
    }
    catch(error){
        return Promise.reject(error.response.data);
    }
}

//remove from cart
const removeFromCart = async(productId) => {
    try{
        const response = await api.delete(`/Cart/remove/${productId}`);
        return response.data;
    }
    catch(error) {
        return Promise.reject(error.response.data);
    }
}

// Miktar Güncelleme
const updateQuantity = async (productId, quantity) => {
    const response = await api.put('/Cart/update-quantity', { productId, quantity });
    return response.data;
};

export const cartService = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity
}