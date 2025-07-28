"use client";

import { useRouter as useNextRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useTransition } from 'react';
import {useNavigationStore} from "@/app/store/navigationStore";

export function useNavigatingRouter() {
    const router = useNextRouter();
    const { setIsNavigating } = useNavigationStore();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!isPending) {
            const timer = setTimeout(() => {
                setIsNavigating(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isPending, setIsNavigating]);

    const push = useCallback((href: string) => {
        setIsNavigating(true);
        startTransition(() => {
            router.push(href);
        });
    }, [router, setIsNavigating, startTransition]);

    const replace = useCallback((href: string) => {
        setIsNavigating(true);
        startTransition(() => {
            router.replace(href);
        });
    }, [router, setIsNavigating, startTransition]);

    return {
        ...router,
        push,
        replace,
    };
}