import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/features/auth/store';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, initializing, initialize } = useAuthStore();

    useEffect(() => {
        initialize().then(() => {});
    }, [initialize]);

    useEffect(() => {
        if (!initializing && !isAuthenticated) {
            router.push('/login').then(() => {});
        }
    }, [initializing, isAuthenticated, router]);

    if (initializing) {
        return fallback || <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return fallback || <div>Redirecting...</div>;
    }

    return <>{children}</>;
}
