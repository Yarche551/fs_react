import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { freelancersApi } from '@/api/freelancers.api';
import { getErrorMessage } from '@/api/http';
import type { Freelancer, FreelancerFormData } from '@/types';

export interface FreelancersState {
    items: Freelancer[];
    current: Freelancer | null;
    listLoading: boolean;
    itemLoading: boolean;
    saving: boolean;
    error: string | null;
}

const initialState: FreelancersState = {
    items: [],
    current: null,
    listLoading: false,
    itemLoading: false,
    saving: false,
    error: null,
};

export const fetchFreelancers = createAsyncThunk<Freelancer[], void, { rejectValue: string }>(
    'freelancers/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await freelancersApi.getAll();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при запросе фрилансеров'));
        }
    },
);

export const fetchFreelancer = createAsyncThunk<Freelancer, string, { rejectValue: string }>(
    'freelancers/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            return await freelancersApi.getOne(id);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при запросе фрилансера'));
        }
    },
);

export const createFreelancer = createAsyncThunk<string, FreelancerFormData, { rejectValue: string }>(
    'freelancers/create',
    async (payload, { rejectWithValue }) => {
        try {
            const result = await freelancersApi.create(payload);
            if (!result.id) {
                return rejectWithValue(result.message || 'Возникла ошибка при добавлении фрилансера');
            }
            return result.id;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при добавлении фрилансера'));
        }
    },
);

export const updateFreelancer = createAsyncThunk<
    string,
    { id: string; data: Partial<FreelancerFormData> },
    { rejectValue: string }
>('freelancers/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        await freelancersApi.update(id, data);
        return id;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при редактировании фрилансера'));
    }
});

export const deleteFreelancer = createAsyncThunk<string, string, { rejectValue: string }>(
    'freelancers/delete',
    async (id, { rejectWithValue }) => {
        try {
            await freelancersApi.remove(id);
            return id;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Возникла ошибка при удалении фрилансера'));
        }
    },
);

const freelancersSlice = createSlice({
    name: 'freelancers',
    initialState,
    reducers: {
        clearCurrentFreelancer(state) {
            state.current = null;
        },
        clearFreelancersError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFreelancers.pending, (state) => {
                state.listLoading = true;
                state.error = null;
            })
            .addCase(fetchFreelancers.fulfilled, (state, action) => {
                state.listLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchFreelancers.rejected, (state, action) => {
                state.listLoading = false;
                state.error = action.payload ?? 'Возникла ошибка при запросе фрилансеров';
            })
            .addCase(fetchFreelancer.pending, (state) => {
                state.itemLoading = true;
                state.error = null;
                state.current = null;
            })
            .addCase(fetchFreelancer.fulfilled, (state, action) => {
                state.itemLoading = false;
                state.current = action.payload;
            })
            .addCase(fetchFreelancer.rejected, (state, action) => {
                state.itemLoading = false;
                state.error = action.payload ?? 'Возникла ошибка при запросе фрилансера';
            })
            .addCase(deleteFreelancer.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
                if (state.current?.id === action.payload) {
                    state.current = null;
                }
            })
            .addMatcher(
                (action) =>
                    [createFreelancer.pending.type, updateFreelancer.pending.type, deleteFreelancer.pending.type]
                        .includes(action.type),
                (state) => {
                    state.saving = true;
                    state.error = null;
                },
            )
            .addMatcher(
                (action) =>
                    [createFreelancer.fulfilled.type, updateFreelancer.fulfilled.type, deleteFreelancer.fulfilled.type]
                        .includes(action.type),
                (state) => {
                    state.saving = false;
                },
            )
            .addMatcher(
                (action): action is { type: string; payload?: string } =>
                    [createFreelancer.rejected.type, updateFreelancer.rejected.type, deleteFreelancer.rejected.type]
                        .includes(action.type),
                (state, action) => {
                    state.saving = false;
                    state.error = action.payload ?? 'Возникла ошибка при сохранении фрилансера';
                },
            );
    },
});

export const { clearCurrentFreelancer, clearFreelancersError } = freelancersSlice.actions;
export default freelancersSlice.reducer;
