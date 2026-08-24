import config from '@/config/config';

export function formatDate(value?: string | null): string {
    if (!value) {
        return '';
    }
    return new Date(value).toLocaleDateString('ru-RU');
}

export function formatDateTime(value?: string | null): string {
    if (!value) {
        return '';
    }
    return new Date(value).toLocaleString('ru-RU');
}

/**
 * Аватары отдаются backend-ом как относительный путь вида /images/freelancers/...
 */
export function avatarUrl(avatar?: string | null): string {
    if (!avatar) {
        return config.host + '/images/freelancers/avatar-stub.png';
    }
    return avatar.startsWith('http') ? avatar : config.host + avatar;
}

export function fullName(person?: { name: string; lastName: string } | null): string {
    if (!person) {
        return '';
    }
    return `${person.name} ${person.lastName}`.trim();
}

/** Дата в формате ISO 8601 без миллисекунд — backend валидирует именно такой формат. */
export function toIsoString(date: Date): string {
    return date.toISOString();
}
