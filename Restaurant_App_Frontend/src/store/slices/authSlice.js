import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode'; // Token'ı çözmek için

// Token'ı ve kullanıcıyı localStorage'dan okuyarak başla
const token = localStorage.getItem('token');
let decodedUser = null;
if (token) {
  try {
    decodedUser = jwtDecode(token);
    if (decodedUser.exp * 1000 < Date.now()) { // Token süresi geçmiş mi?
      localStorage.removeItem('token');
      decodedUser = null;
    }
  } catch (e) {
    localStorage.removeItem('token');
    decodedUser = null;
  }
}
// Initial state'i 'user' objesini içerecek şekilde güncelle
const initialState = {
  user: decodedUser ? { 
    email: decodedUser.email, 
    role: decodedUser['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
  } : null,
  token: token || null,
  isAuthenticated: !!decodedUser, //
  status: 'idle',
  error: null,
};
//asenkron api isteği login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post('/Auth/login', loginData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // Token'ı çöz ve user objesini döndür
      const decoded = jwtDecode(token);
      const user = {
        email: decoded.email,
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      };
      
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response.data || 'Giriş başarısız!');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (registerData, { rejectWithValue }) => {
    try {
      await api.post('/Auth/register', registerData);
      return;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Kayıt başarısız!');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.user = null; // User objesini de temizle
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user; // State'i user objesiyle güncelle
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.token = null;
        state.isAuthenticated = false;
        state.user = null; // Hata durumunda user'ı temizle
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;