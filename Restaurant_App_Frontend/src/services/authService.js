import api from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

// Login 
const login = async(loginData) => {
    try{
        const response = await api.post('Auth/login', loginData);
        const {token} = response.data;
        localStorage.setItem('token', token);

        const decoded = jwtDecode(token);
        const user = {
            email: decoded.email,
            fullName: decoded.unique_name || decoded.name || decoded.email, // FullName JWT'den alınır
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded['role'] || 'User'
        };
        return {token, user};
    } catch(error) {
        if (error.response) {
            return Promise.reject(error.response.data || 'Giriş başarısız!');
        } else {
            return Promise.reject(error.message || 'Sunucuya bağlanılamadı.');
        }
    }
};

// REGISTER 
const register = async(registerData) => {
    try {
        await api.post('Auth/register', registerData);
        return true;
    } catch(error) {
        console.log("🛑 REGISTER HATASI:", error);
        if (error.response && error.response.data) {
            const data = error.response.data;
            if (data.errors && Array.isArray(data.errors)) return Promise.reject(data.errors.join('\n'));
            if (data.errors && typeof data.errors === 'object') return Promise.reject(Object.values(data.errors).flat().join('\n'));
            if (typeof data === 'string') return Promise.reject(data);
            if (data.message) return Promise.reject(data.message);
            return Promise.reject("Kayıt işlemi başarısız.");
        }
        return Promise.reject(error.message || "Sunucu hatası.");
    }
}
const getProfile = async () => {
    try {
        // axiosInstance'ın (api) token'ı otomatik ekleyecek
        const response = await api.get('Auth/get-profile');
        return response.data; // Backend'den gelen UserDTO
    } catch (error) {
        return Promise.reject(error.response?.data || 'Profil bilgileri alınamadı.');
    }
};
// PROFİL GÜNCELLEME 
const updateProfile = async (userData) => {
    try {
        const response = await api.put('/Auth/update-profile', userData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || 'Profil güncelleme hatası');
    }
};

const logout = () => {
    localStorage.removeItem('token');
}

export const authService = {
    login,
    register,
    logout,
    updateProfile,
    getProfile
}