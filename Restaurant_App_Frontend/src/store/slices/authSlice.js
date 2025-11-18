import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode'; // Token'ı çözmek için
import {authService} from '../../services/authService';


const token = localStorage.getItem('token');
let user = null;
if (token) {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
    } else {
      user = {
        email: decoded.email,
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      };
    }
  } catch (e) { localStorage.removeItem('token'); }
}

const initialState = {
  user: user,
  token: user ? token : null,
  isAuthenticated: !!user, //
  status: 'idle',
  error: null,
};


// createAsyncThunk'ı 'authService'i kullanacak şekilde 
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      // 3. API'yi değil, servisi çağır
      const data = await authService.login(loginData);
      return data; // { token, user } objesini döndür
    } catch (error) {
      return rejectWithValue(error); // Hata servisten zaten işlenmiş geliyor
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (registerData, { rejectWithValue }) => {
    try {
      await authService.register(registerData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout(); // localStorage'ı temizle
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Register (Sadece toast bildirimi için durum tutabiliriz)
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;