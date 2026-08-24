import { ORDER_STATUSES } from '@/config/config';
import type { OrderStatus } from '@/types';

interface StatusBadgeProps {
    status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const info = ORDER_STATUSES[status];
    if (!info) {
        return <span className="badge badge-secondary">Неизвестно</span>;
    }
    return <span className={`badge badge-${info.color}`}>{info.label}</span>;
}
