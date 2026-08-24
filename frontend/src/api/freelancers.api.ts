import { http } from './http';
import type { ApiMessageResponse, Freelancer, FreelancerFormData } from '@/types';

export const freelancersApi = {
    async getAll(): Promise<Freelancer[]> {
        const { data } = await http.get<{ freelancers: Freelancer[] }>('/freelancers');
        return data.freelancers;
    },

    async getOne(id: string): Promise<Freelancer> {
        const { data } = await http.get<Freelancer>(`/freelancers/${id}`);
        return data;
    },

    async create(payload: FreelancerFormData): Promise<ApiMessageResponse> {
        const { data } = await http.post<ApiMessageResponse>('/freelancers', payload);
        return data;
    },

    async update(id: string, payload: Partial<FreelancerFormData>): Promise<ApiMessageResponse> {
        const { data } = await http.put<ApiMessageResponse>(`/freelancers/${id}`, payload);
        return data;
    },

    async remove(id: string): Promise<ApiMessageResponse> {
        const { data } = await http.delete<ApiMessageResponse>(`/freelancers/${id}`);
        return data;
    },
};
