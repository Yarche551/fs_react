export const EMAIL_PATTERN = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
export const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

export function isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
}

export function isEmail(value: string): boolean {
    return EMAIL_PATTERN.test(value);
}

export function isStrongPassword(value: string): boolean {
    return PASSWORD_PATTERN.test(value);
}
