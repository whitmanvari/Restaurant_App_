import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';

const initialState = {
  items: [], 
  totalAmount: 0,
  status: 'idle', 
  error: null,
};

// API İSTEĞİ: Sepeti Getir
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartService.getCart();
      return data; 
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
      // Backend artık güncel sepeti (CartDTO) dönüyor
      const data = await cartService.addToCart(productId, quantity);
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Ekleme hatası");
    }
  }
);

// API İSTEĞİ: Sepetten Sil 
export const removeProductFromCart = createAsyncThunk(
    'cart/removeProductFromCart',
    async (productId, { rejectWithValue }) => {
      try {
        const data = await cartService.removeFromCart(productId);
        return data; 
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

  // Miktar Güncelleme
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await cartService.updateQuantity(productId, quantity);
      return data; // Güncel sepet döner
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.status = 'idle';
    }
  },

  extraReducers: (builder) => {
    
    // YARDIMCI FONKSİYON: State Güncelleme
    const updateCartState = (state, action) => {
      state.status = 'succeeded';
      const cartData = action.payload;

      state.items = cartData.items || cartData.Items || [];
      state.totalAmount = cartData.totalAmount || cartData.TotalAmount || 0;
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
      })
      //update quantity 
      .addCase(updateCartItemQuantity.pending, (state) => { state.status = 'loading'; })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const cartData = action.payload;
          state.items = cartData.items || cartData.Items || [];
          state.totalAmount = cartData.totalAmount || cartData.TotalAmount || 0;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;