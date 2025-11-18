import api from '../api/axiosInstance';
import {jwtDecode} from 'jwt-decode';

//Login
const login = async(loginData) => {
    try{
        const response = await api.post('Auth/login', loginData);
        const {token} = response.data;
        localStorage.setItem('token', token);

        //tokenı çöz ve user objesine döndür.
        const decoded = jwtDecode(token);
        const user = {
            email: decoded.email,
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        };
        return {token, user};
    } catch(error) {
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
const register = async(registerData) => {
    try {
        await api.post('Auth/register', registerData);
        return true;
    } catch(error) {
        if (error.response) {
            const data = error.response.data;
            if(data.errors && Array.isArray(data.errors)){
                const errorMessage = data.errors.join('\n');
                return Promise.reject(errorMessage);
            }
            // büyük e harfi ile error geldiyse
            if(data.Errors && Array.isArray(data.errors)){
                const errorMessage = data.errors.join('\n');
                return Promise.reject(errorMessage);
            }
            //başka bir formatta geldiyse 
            return Promise.reject(data.message || data || 'Kayıt başarısız!');
        } else {
            //network hatasıysa
            return Promise.reject(error.message || 'Sunucuya bağlanılamadı.');
        }
    }
}

const logout = () => {
    localStorage.removeItem('token');
}
// Tüm auth fonksiyonlarını tek bir nesne olarak export et
export const authService = {
    login,
    register,
    logout
}