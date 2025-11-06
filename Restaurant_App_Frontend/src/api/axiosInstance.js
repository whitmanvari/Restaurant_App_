import axios from 'axios';

const API_URL = "https://localhost:7254/api";
//axios instance'ı 
//tüm api isteklerinde axios yerine, apileri kullanacak.
const api = axios.create({
    baseURL: API_URL
});

//Global api katmanı (interceptor) api kullanarak istek atmadan önce araya girer.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        //eğer token varsa headera yaz
        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        //istek gönderilmeden hata oluşursa
        return Promise.reject(error);
    }
);

export default api;