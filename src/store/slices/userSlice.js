import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import {
//   getBrandByIdAPI,
//   getStoreByIdAPI,
//   getUserByIdAPI,
// } from '../../services/handleApi';

const initialState = {
  user: null,
  brand: null,
  store: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk('user/fetchUser', async id => {
  try {
    // const response = await getUserByIdAPI(id);
    // return response;
  } catch (error) {
    console.log('Error', error);
  }
});

export const fetchBrand = createAsyncThunk('user/fetchBrand', async id => {
  try {
    // const response = await getBrandByIdAPI(id);
    // return response;
  } catch (error) {
    console.log('Error', error);
  }
});

export const fetchStore = createAsyncThunk('user/fetchStore', async id => {
  try {
    // const response = await getStoreByIdAPI(id);
    // return response;
  } catch (error) {
    console.log('Error', error);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });

    builder
      .addCase(fetchBrand.pending, state => {
        state.loading = true;
      })
      .addCase(fetchBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brand = action.payload;
      })
      .addCase(fetchBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });

    builder
      .addCase(fetchStore.pending, state => {
        state.loading = true;
      })
      .addCase(fetchStore.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(fetchStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default userSlice.reducer;
