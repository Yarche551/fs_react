import type { UserInfo } from '@/types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_INFO_KEY = 'userInfo';

export interface StoredAuth {
    accessToken: string;
    refreshToken: string;
    userInfo: UserInfo | null;
}

export const authStorage = {
    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    getUserInfo(): UserInfo | null {
        const raw = localStorage.getItem(USER_INFO_KEY);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw) as UserInfo;
        } catch {
            return null;
        }
    },

    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    setUserInfo(userInfo: UserInfo): void {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    },

    clear(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
    },
};
