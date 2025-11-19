import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productService } from "../../services/productService";

const initialState = {
    products: [],
    pagination: {
        pageNumber: 1,
        pageSize: 6,
        totalPages: 0,
        totalRecords: 0
    },
    status: 'idle',
    error: null
};

// Filtreli ve Sayfalı Ürün Çekme
export const fetchProductsByFilter = createAsyncThunk(
    'products/fetchProductsByFilter',
    async (filterParams, { rejectWithValue }) => {
        try {
            // filterParams örneği: { pageNumber: 1, searchTerm: 'burger', category: 'Ana Yemekler' }
            const data = await productService.getProductsByFilter(filterParams);
            return data; // Backend'den dönen PagedResponse<ProductDTO>
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // Sayfa numarasını resetlemek veya değiştirmek istersek manuel reducer
        setPageNumber: (state, action) => {
            state.pagination.pageNumber = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //FETCH FILTERED
            .addCase(fetchProductsByFilter.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsByFilter.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload.data; // PagedResponse içindeki Data listesi

                // Pagination bilgilerini güncelle
                state.pagination.pageNumber = action.payload.pageNumber;
                state.pagination.pageSize = action.payload.pageSize;
                state.pagination.totalRecords = action.payload.totalRecords;
                state.pagination.totalPages = action.payload.totalPages;
            })
            .addCase(fetchProductsByFilter.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setPageNumber } = productSlice.actions;
export default productSlice.reducer;