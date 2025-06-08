import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getInfluencerByIdAPI} from '../../services/handleApi';

const initialState = {
  onBoarding: null,
  loading: false,
  error: null,
};

export const fetchInfluencerById = createAsyncThunk(
  'onBoarding/fetchInfluencerById',
  async id => {
    try {
      const response = await getInfluencerByIdAPI(id);
      return response;
    } catch (error) {
      console.error('Error', error);
    }
  },
);

const onBoardingSlice = createSlice({
  name: 'onBoarding',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchInfluencerById.pending, state => {
        state.loading = true;
      })
      .addCase(fetchInfluencerById.fulfilled, (state, action) => {
        state.loading = false;
        state.onBoarding = action.payload;
      })
      .addCase(fetchInfluencerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default onBoardingSlice.reducer;
