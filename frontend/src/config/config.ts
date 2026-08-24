import type { FreelancerLevel, OrderStatus } from '@/types';

const host: string = import.meta.env.VITE_API_HOST || 'http://localhost:3000';

export const config = {
    host,
    api: `${host}/api`,
} as const;

export const FREELANCER_LEVELS: Record<FreelancerLevel, { label: string; badgeClass: string }> = {
    junior: { label: 'Junior', badgeClass: 'badge-info' },
    middle: { label: 'Middle', badgeClass: 'badge-warning' },
    senior: { label: 'Senior', badgeClass: 'badge-success' },
};

export const ORDER_STATUSES: Record<OrderStatus, { label: string; color: string; icon: string }> = {
    new: { label: 'Новый', color: 'secondary', icon: 'star' },
    confirmed: { label: 'Подтвержден', color: 'info', icon: 'eye' },
    success: { label: 'Выполнен', color: 'success', icon: 'check' },
    canceled: { label: 'Отменен', color: 'danger', icon: 'times' },
};

export default config;
