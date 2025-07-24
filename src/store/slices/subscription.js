import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getSubscriptionPurchasedByInfluencerIdAPI} from '../../services/handleApi';

const initialState = {
  subscription: null,
  loading: false,
  error: null,
};

export const fetchSubscription = createAsyncThunk(
  'subscription/fetchSubscription',
  async id => {
    try {
      const response = await getSubscriptionPurchasedByInfluencerIdAPI(id);
      return response;
    } catch (error) {
      console.error('Error', error);
    }
  },
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSubscription.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default subscriptionSlice.reducer;
