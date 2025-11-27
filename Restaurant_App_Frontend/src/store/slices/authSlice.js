import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../../services/authService';

// Yardımcı Fonksiyon: Token'ı Güvenli Şekilde Çöz
const getUserFromToken = (token) => {
    if (!token || typeof token !== 'string') return null;

    try {
        const decoded = jwtDecode(token);
        
        // Süre Kontrolü
        if (decoded.exp * 1000 < Date.now()) {
            console.warn("Token süresi dolmuş, oturum kapatılıyor.");
            localStorage.removeItem('token');
            return null;
        }

        // 2. Rol Yakalama
        // ASP.NET Identity rolü genellikle bu uzun anahtarda saklar
        let role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded['role'] || 'User';

        // Eğer kullanıcıya birden fazla rol atanmışsa (Array gelirse) ve içinde Admin varsa, Admin yap.
        if (Array.isArray(role)) {
            role = role.includes('Admin') ? 'Admin' : role[0];
        }

        // İsim Yakalama
        // Backend AuthManager'daki "fullName" claim'ini burada yakalıyoruz
        const fullName = decoded['fullName'] || decoded['unique_name'] || 'Kullanıcı';

        return {
            id: decoded.sub, 
            email: decoded.email,
            fullName: fullName, 
            role: role
        };

    } catch (error) {
        console.error("Token decode hatası:", error);
        localStorage.removeItem('token');
        return null;
    }
};

// Başlangıç State'ini Ayarla
const token = localStorage.getItem('token');
const user = getUserFromToken(token);

const initialState = {
    user: user,
    token: user ? token : null, // User null ise token da null olmalı (süresi dolmuşsa)
    isAuthenticated: !!user,
    status: 'idle',
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await authService.login(loginData);
            const accessToken = response.Token || response.token; 
            
            if (!accessToken) throw new Error("Token alınamadı");

            localStorage.setItem('token', accessToken);
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
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;