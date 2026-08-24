import { http } from './http';
import type { ApiMessageResponse, Order, OrderFormData } from '@/types';

export const ordersApi = {
    async getAll(): Promise<Order[]> {
        const { data } = await http.get<{ orders: Order[] }>('/orders');
        return data.orders;
    },

    async getOne(id: string): Promise<Order> {
        const { data } = await http.get<Order>(`/orders/${id}`);
        return data;
    },

    async create(payload: OrderFormData): Promise<ApiMessageResponse> {
        const { data } = await http.post<ApiMessageResponse>('/orders', payload);
        return data;
    },

    async update(id: string, payload: Partial<OrderFormData>): Promise<ApiMessageResponse> {
        const { data } = await http.put<ApiMessageResponse>(`/orders/${id}`, payload);
        return data;
    },

    async remove(id: string): Promise<ApiMessageResponse> {
        const { data } = await http.delete<ApiMessageResponse>(`/orders/${id}`);
        return data;
    },
};
