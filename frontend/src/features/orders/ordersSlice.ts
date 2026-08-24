import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ordersApi } from '@/api/orders.api';
import { getErrorMessage } from '@/api/http';
import type { Order, OrderFormData } from '@/types';

export interface OrdersState {
    items: Order[];
    current: Order | null;
    listLoading: boolean;
    itemLoading: boolean;
    saving: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    items: [],
    current: null,
    listLoading: false,
    itemLoading: false,
    saving: false,
    error: null,
};

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await ordersApi.getAll();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при запросе заказов'));
        }
    },
);

export const fetchOrder = createAsyncThunk<Order, string, { rejectValue: string }>(
    'orders/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            return await ordersApi.getOne(id);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при запросе заказа'));
        }
    },
);

export const createOrder = createAsyncThunk<string, OrderFormData, { rejectValue: string }>(
    'orders/create',
    async (payload, { rejectWithValue }) => {
        try {
            const result = await ordersApi.create(payload);
            if (!result.id) {
                return rejectWithValue(result.message || 'Возникла ошибка при добавлении заказа');
            }
            return result.id;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при добавлении заказа'));
        }
    },
);

export const updateOrder = createAsyncThunk<
    string,
    { id: string; data: Partial<OrderFormData> },
    { rejectValue: string }
>('orders/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        await ordersApi.update(id, data);
        return id;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при редактировании заказа'));
    }
});

export const deleteOrder = createAsyncThunk<string, string, { rejectValue: string }>(
    'orders/delete',
    async (id, { rejectWithValue }) => {
        try {
            await ordersApi.remove(id);
            return id;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при удалении заказа'));
        }
    },
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearCurrentOrder(state) {
            state.current = null;
        },
        clearOrdersError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.listLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.listLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.listLoading = false;
                state.error = action.payload ?? 'Возникла ошибка при запросе заказов';
            })
            .addCase(fetchOrder.pending, (state) => {
                state.itemLoading = true;
                state.error = null;
                state.current = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.itemLoading = false;
                state.current = action.payload;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.itemLoading = false;
                state.error = action.payload ?? 'Возникла ошибка при запросе заказа';
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
                if (state.current?.id === action.payload) {
                    state.current = null;
                }
            })
            .addMatcher(
                (action) =>
                    [createOrder.pending.type, updateOrder.pending.type, deleteOrder.pending.type].includes(action.type),
                (state) => {
                    state.saving = true;
                    state.error = null;
                },
            )
            .addMatcher(
                (action) =>
                    [createOrder.fulfilled.type, updateOrder.fulfilled.type, deleteOrder.fulfilled.type]
                        .includes(action.type),
                (state) => {
                    state.saving = false;
                },
            )
            .addMatcher(
                (action): action is { type: string; payload?: string } =>
                    [createOrder.rejected.type, updateOrder.rejected.type, deleteOrder.rejected.type]
                        .includes(action.type),
                (state, action) => {
                    state.saving = false;
                    state.error = action.payload ?? 'Возникла ошибка при сохранении заказа';
                },
            );
    },
});

export const { clearCurrentOrder, clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
