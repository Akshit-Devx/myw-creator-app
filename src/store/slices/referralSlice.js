import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getReferralByInfluencerId} from '../../services/handleApi';

const initialState = {
  referrals: null,
  loading: false,
  error: null,
};

export const fetchReferralByInfluencerId = createAsyncThunk(
  'referral/fetchReferralByInfluencerId',
  async id => {
    try {
      const response = await getReferralByInfluencerId(id);

      console.log('response', response);

      return response?.data?.getReferralTrackingByInfluencerId?.items?.[0];
    } catch (error) {
      console.error('Error', error);
    }
  },
);

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchReferralByInfluencerId.pending, state => {
        state.loading = true;
      })
      .addCase(fetchReferralByInfluencerId.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload;
      })
      .addCase(fetchReferralByInfluencerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default referralSlice.reducer;
