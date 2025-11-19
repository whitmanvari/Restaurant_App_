import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';

const initialState = {
  items: [], // Sepetteki ürünler
  totalAmount: 0,
  status: 'idle', // 'idle','loading','succeeded','failed'
  error: null,
};

// API İSTEĞİ: Sepeti Getir
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartService.getCart();
      return data; // CartDTO
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API İSTEĞİ: Sepete Ekle
export const addProductToCart = createAsyncThunk(
  'cart/addProductToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await cartService.addToCart(productId, quantity);
      return data; // Güncel CartDTO
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API İSTEĞİ: Sepetten Sil 
export const removeProductFromCart = createAsyncThunk(
    'cart/removeProductFromCart',
    async (productId, { rejectWithValue }) => {
      try {
        // Backend silme işleminden sonra güncel sepeti dönmeli (CartDTO)
        const data = await cartService.removeFromCart(productId);
        return data; 
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  // Asenkron eylemlerin sonuçlarını yönet
  extraReducers: (builder) => {
    // Hem 'fetchCart' hem 'addProductToCart' başarılı olduğunda
    // state'i güncelleyen genel bir yardımcı
    const updateCartState = (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload.items;
      state.totalAmount = action.payload.totalAmount;
    };

    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCart.fulfilled, updateCartState)
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // addProductToCart
      .addCase(addProductToCart.pending, (state) => { state.status = 'loading'; })
      .addCase(addProductToCart.fulfilled, updateCartState)
      .addCase(addProductToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // removeProductFromCart
      .addCase(removeProductFromCart.pending, (state) => { state.status = 'loading'; })
      .addCase(removeProductFromCart.fulfilled, updateCartState)
      .addCase(removeProductFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;