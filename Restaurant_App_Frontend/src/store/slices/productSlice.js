import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productService } from "../../services/productService";

const initialState = {
    products : [],
    status: 'idle', //loading,succeeded, failed
    error: null
};

//api isteği: tüm ürünleri çekme
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue}) => {
        try {
            const data = await productService.getAll();
            return data; //dönen dto listesi
        } catch(error) {
            return rejectWithValue(error);
        }
    }
);

//api isteği: kategoriye göre ürün çekme
export const fetchProductsByCategory = createAsyncThunk(
    'products/fetchProductsByCategory',
    async(categoryName, {rejectWithValue}) => {
        try{
            const data = await productService.getByCategory(categoryName);
            return data;
        }
        catch(error) {
            return rejectWithValue(error);
        }
    }
)
export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload; //ürün listesini state'e kaydet
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload; // Gelen yeni listeyle değiştir
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
        },
    });

export default productSlice.reducer;