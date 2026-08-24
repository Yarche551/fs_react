import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '@/api/auth.api';
import { getErrorMessage } from '@/api/http';
import { authStorage } from '@/utils/auth-storage';
import type { LoginRequest, SignUpRequest, UserInfo } from '@/types';

export interface AuthState {
    user: UserInfo | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: authStorage.getUserInfo(),
    isAuthenticated: Boolean(authStorage.getAccessToken()),
    loading: false,
    error: null,
};

export const login = createAsyncThunk<UserInfo, LoginRequest, { rejectValue: string }>(
    'auth/login',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await authApi.login(payload);
            if (!data.accessToken || !data.refreshToken || !data.id || !data.name) {
                return rejectWithValue('Неправильный email или пароль');
            }
            authStorage.setTokens(data.accessToken, data.refreshToken);
            const user: UserInfo = { id: data.id, name: data.name };
            authStorage.setUserInfo(user);
            return user;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Неправильный email или пароль'));
        }
    },
);

export const signUp = createAsyncThunk<UserInfo, SignUpRequest, { rejectValue: string }>(
    'auth/signUp',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await authApi.signUp(payload);
            if (!data.accessToken || !data.refreshToken || !data.id || !data.name) {
                return rejectWithValue('Не удалось зарегистрировать пользователя');
            }
            authStorage.setTokens(data.accessToken, data.refreshToken);
            const user: UserInfo = { id: data.id, name: data.name };
            authStorage.setUserInfo(user);
            return user;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, 'Не удалось зарегистрировать пользователя. Обратитесь в поддержку.'),
            );
        }
    },
);

export const logout = createAsyncThunk<void, void>('auth/logout', async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
        try {
            await authApi.logout(refreshToken);
        } catch {
            // даже если backend ответил ошибкой — локальную сессию всё равно чистим
        }
    }
    authStorage.clear();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Неправильный email или пароль';
            })
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Не удалось зарегистрировать пользователя';
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            });
    },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
