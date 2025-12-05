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
            console.log("📦 HATA İÇERİĞİ:", data);

            // SENARYO 1: Identity Hataları 
            // { "errors": ["Kullanıcı zaten var", "Email kullanımda"] }
            if (data.errors && Array.isArray(data.errors)) {
                return Promise.reject(data.errors.join('\n'));
            }

            // SENARYO 2: ASP.NET Core Standart Validasyon 
            // { "errors": { "Password": ["Hata1"] } }
            if (data.errors && typeof data.errors === 'object') {
                const messages = Object.values(data.errors).flat().join('\n');
                return Promise.reject(messages);
            }

            // SENARYO 3: "Errors" Dizi ise
            if (data.Errors && Array.isArray(data.Errors)) {
                return Promise.reject(data.Errors.join('\n'));
            }
            
            // SENARYO 4: Tekil Mesaj
            if (typeof data === 'string') return Promise.reject(data);
            if (data.message) return Promise.reject(data.message);

            // Hiçbiri değilse
            return Promise.reject("Kayıt işlemi başarısız.");
        }
        
        return Promise.reject(error.message || "Sunucu hatası.");
    }
}

const updateProfile = async (data) => {
    try {
        const response = await api.put('/Auth/update-profile', data);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || 'Güncelleme hatası');
    }
};

const getProfile = async () => {
    try {
        const response = await api.get('/Auth/get-profile');
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || 'Profil çekme hatası');
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