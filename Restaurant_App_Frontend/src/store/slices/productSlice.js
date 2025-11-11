import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products : [],
    status: 'idle',
    error: null
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue}) => {
        try {
            const response = await api.get('/Product/GetAll');
            return response.data; //dönen dto listesi
        } catch(error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fullfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload; //ürün listesini state'e kaydet
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    }
})

export default productSlice.reducer;