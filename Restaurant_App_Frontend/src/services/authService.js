import api from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

//Login
const login = async (loginData) => {
    try {
        const response = await api.post('Auth/login', loginData);
        const { token } = response.data;
        localStorage.setItem('token', token);

        //tokenı çöz ve user objesine döndür.
        const decoded = jwtDecode(token);
        const user = {
            email: decoded.email,
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        };
        return { token, user };
    } catch (error) {
        if (error.response) {
            // Sunucudan 401 gibi bir hata gelirse
            return Promise.reject(error.response.data || 'Giriş başarısız!');
        } else {
            // Network hatası (CORS, ERR_FAILED vb.) gelirse
            return Promise.reject(error.message || 'Sunucuya bağlanılamadı.');
        }
    }
};

//register
const register = async (registerData) => {
    try {
        await api.post('Auth/register', registerData);
        return true;
    } catch (error) {
        console.log("🛑 REGISTER API ERROR:", error);

        if (error.response && error.response.data) {
            const data = error.response.data;
            console.log("📦 HATA İÇERİĞİ:", data);

            // 1. ASP.NET Core Standart Validasyon ({ errors: { Key: [Msg] } })
            // Konsol çıktına göre senin durumun bu!
            if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
                // Nesnenin içindeki değerleri al, düzleştir ve birleştir.
                // Örn: { PhoneNumber: ["Hata"] } -> "Hata"
                const messages = Object.values(data.errors).flat().join('\n');
                return Promise.reject(messages);
            }

            // 2. Identity Hataları ({ Errors: ["Msg"] })
            if (data.Errors && Array.isArray(data.Errors)) {
                return Promise.reject(data.Errors.join('\n'));
            }

            // 3. Tekil Mesaj
            if (typeof data === 'string') return Promise.reject(data);
            if (data.message) return Promise.reject(data.message);

            // 4. Bilinmeyen Format
            return Promise.reject("Kayıt işlemi başarısız. Lütfen bilgileri kontrol edin.");
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
// Tüm auth fonksiyonlarını tek bir nesne olarak export et
export const authService = {
    login,
    register,
    logout,
    updateProfile,
    getProfile
}