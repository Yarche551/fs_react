import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import config from '@/config/config';
import { authStorage } from '@/utils/auth-storage';
import type { ApiErrorResponse, RefreshResponse } from '@/types';

interface RetriableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
    skipAuth?: boolean;
}

export const http = axios.create({
    baseURL: config.api,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

http.interceptors.request.use((requestConfig: RetriableConfig) => {
    if (!requestConfig.skipAuth) {
        const token = authStorage.getAccessToken();
        if (token) {
            requestConfig.headers.set('authorization', token);
        }
    }
    return requestConfig;
});

/** Общий промис обновления токена, чтобы параллельные 401 не плодили запросы. */
let refreshPromise: Promise<string | null> | null = null;

async function refreshTokens(): Promise<string | null> {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
        return null;
    }

    try {
        const { data } = await axios.post<RefreshResponse>(
            `${config.api}/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } },
        );
        if (data?.accessToken && data?.refreshToken) {
            authStorage.setTokens(data.accessToken, data.refreshToken);
            return data.accessToken;
        }
        return null;
    } catch {
        return null;
    }
}

http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as RetriableConfig | undefined;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.skipAuth
        ) {
            originalRequest._retry = true;

            refreshPromise = refreshPromise ?? refreshTokens();
            const newAccessToken = await refreshPromise;
            refreshPromise = null;

            if (newAccessToken) {
                originalRequest.headers.set('authorization', newAccessToken);
                return http.request(originalRequest);
            }

            authStorage.clear();
            if (window.location.pathname !== '/login') {
                window.location.assign('/login');
            }
        }

        return Promise.reject(error);
    },
);

/** Запрос без авторизации (login / sign-up / refresh / logout). */
export function publicRequest<T>(requestConfig: AxiosRequestConfig): Promise<T> {
    return http.request<T>({ ...requestConfig, skipAuth: true } as AxiosRequestConfig).then((r) => r.data);
}

export function getErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message ?? error.message ?? fallback;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}
