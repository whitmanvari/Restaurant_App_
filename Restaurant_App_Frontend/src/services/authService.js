import api from '../api/axiosInstance';
import {jtwDecode} from 'jwt-decode';

//Login
const login = async(loginData) => {
    try{
        const response = await api.post('Auth/login', loginData);
        const {token} = response.data;
        localStorage.setItem('token', token);

        //tokenı çöz ve user objesine döndür.
        const decoded = jtwDecode(token);
        const user = {
            email: decoded.email;
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        };
        return {token, user};
    } catch(error) {
        return Promise.reject(error.response.data || 'Giriş Başarısız!'); 
    }
};

//register
const register = async(registerData) => {
    try {
        await api.post('Auth/register', registerData);
        return true;
    } catch(error) {
        return Promise.reject(error.response.data || 'Kayıt Başarısız!');
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