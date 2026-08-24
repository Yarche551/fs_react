import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import freelancersReducer from '@/features/freelancers/freelancersSlice';
import ordersReducer from '@/features/orders/ordersSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        freelancers: freelancersReducer,
        orders: ordersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
