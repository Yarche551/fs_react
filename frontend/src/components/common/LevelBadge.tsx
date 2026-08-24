import { FREELANCER_LEVELS } from '@/config/config';
import type { FreelancerLevel } from '@/types';

interface LevelBadgeProps {
    level: FreelancerLevel;
}

export function LevelBadge({ level }: LevelBadgeProps) {
    const info = FREELANCER_LEVELS[level];
    if (!info) {
        return <span className="badge badge-secondary">Unknown</span>;
    }
    return <span className={`badge ${info.badgeClass}`}>{info.label}</span>;
}
