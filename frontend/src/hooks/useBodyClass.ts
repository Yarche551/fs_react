import { useEffect } from 'react';

/** Добавляет классы на <body> на время жизни компонента (AdminLTE управляет темой через body). */
export function useBodyClass(classNames: string[]): void {
    const key = classNames.join(' ');

    useEffect(() => {
        const classes = key.split(' ').filter(Boolean);
        document.body.classList.add(...classes);
        return () => {
            document.body.classList.remove(...classes);
        };
    }, [key]);
}
