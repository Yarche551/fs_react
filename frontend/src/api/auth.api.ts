import { publicRequest } from './http';
import type { AuthResponse, LoginRequest, SignUpRequest } from '@/types';

export const authApi = {
    login(payload: LoginRequest): Promise<AuthResponse> {
        return publicRequest<AuthResponse>({ url: '/login', method: 'POST', data: payload });
    },

    signUp(payload: SignUpRequest): Promise<AuthResponse> {
        return publicRequest<AuthResponse>({ url: '/signup', method: 'POST', data: payload });
    },

    logout(refreshToken: string): Promise<{ error: boolean; message: string }> {
        return publicRequest({ url: '/logout', method: 'POST', data: { refreshToken } });
    },
};
