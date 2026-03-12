import { configureStore } from '@reduxjs/toolkit';
import { api } from './api/apiSlice';
import authReducer from '../features/auth/authSlice';
import accountsReducer from '../features/accounts/accountsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
