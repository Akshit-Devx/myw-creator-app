import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import onBoardingReducer from './slices/onBoarding';
import subscriptionReducer from './slices/subscription';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['onBoarding', 'subscription'],
};

export const RESET_APP_STATE = 'RESET_APP_STATE';

const rootReducer = combineReducers({
  onBoarding: onBoardingReducer,
  subscription: subscriptionReducer,
});

const rootReducerWithReset = (state, action) => {
  if (action.type === RESET_APP_STATE) {
    state = undefined;
  }
  return rootReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducerWithReset);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const resetStore = () => {
  persistor.purge();
  return {
    type: RESET_APP_STATE,
  };
};

export const persistor = persistStore(store);
export default store;
