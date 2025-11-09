import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const token = localStorage.getItem('token');

const initialState = {
    token: token || null,
    isAuthenticated: token ? true : false,
    status: 'idle',
    error: null
};

//asenkron api isteği login
export const loginUser = createAsyncThunk(
    'auth/loginUser', //reduxta görünecek eylem adı
    async (loginData, {rejectWithValue}) => {
        try{
            const response = await api.post('/Auth/login', loginData);
            const{token} = response.data;
            localStorage.setItem('token', token);
            return token;
        }
        catch(error) {
            return rejectWithValue(error.response.data) || 'Giriş başarısız!';
        }
    }
);
//Register
//asenkron api isteği: register için
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async(registerData, {rejectWithValue}) => {
        try{
            await api.post('/Auth/register'), registerData;
            return;
        }
        catch(error) {
            return rejectWithValue(error.response.data) || 'Kayıt başarısız!';
        }
    }
);

//Auth slice
//token, isauthanticated vb. güncelleyen kuralları içerir
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    //senkron eylemler
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated= false;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            localStorage.setItem('token', action.payload);
            state.status='succeeded';
            state.token = action.payload;
            state.isAuthenticated= true;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload; //hata mesajı
            state.token = null;
            state.isAuthenticated = false;
        });
    },
});
// logout eylemini dışa aktar (componentlerde kullanmak için)
export const {logout} = authSlice.actions;
// reducer'ı dışa aktar (store'da kullanmak için)
export default authSlice.reducer;