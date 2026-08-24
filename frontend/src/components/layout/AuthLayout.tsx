import { useEffect, type ReactNode } from 'react';
import { useBodyClass } from '@/hooks/useBodyClass';

interface AuthLayoutProps {
    bodyClass: 'login-page' | 'register-page';
    children: ReactNode;
}

export function AuthLayout({ bodyClass, children }: AuthLayoutProps) {
    useBodyClass([bodyClass]);

    useEffect(() => {
        document.body.style.height = '100vh';
        return () => {
            document.body.style.height = '';
        };
    }, []);

    return <>{children}</>;
}
