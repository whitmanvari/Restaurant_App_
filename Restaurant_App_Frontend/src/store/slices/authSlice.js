import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../../services/authService';

// Yardımcı Fonksiyon: Token'dan Kullanıcı Bilgisi Çıkar
const getUserFromToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) return null;
        
        return {
            id: decoded.sub, // User ID
            email: decoded.email,
            // Backend'den gelen "fullName" claim'ini okuyoruz
            fullName: decoded.fullName || decoded['fullName'], 
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User'
        };
    } catch (error) {
        return null;
    }
};

// 1. Başlangıç State'ini Ayarla (Sayfa Yenilenince Çalışır)
const token = localStorage.getItem('token');
const user = token ? getUserFromToken(token) : null;

const initialState = {
    user: user,
    token: user ? token : null,
    isAuthenticated: !!user,
    status: 'idle',
    error: null,
};

// 2. Login İşlemi
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await authService.login(loginData);
            // Backend { Token: "..." } dönüyor.
            const accessToken = response.Token;
            
            // Token'ı kaydet
            localStorage.setItem('token', accessToken);
            
            // Token'ı çözümle ve kullanıcıyı oluştur
            const userObj = getUserFromToken(accessToken);
            
            return { token: accessToken, user: userObj };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Giriş başarısız");
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (registerData, { rejectWithValue }) => {
        try {
            await authService.register(registerData);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Kayıt başarısız");
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            authService.logout();
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.user = action.payload.user; 
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;