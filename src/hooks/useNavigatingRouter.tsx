"use client";

import {usePathname, useRouter as useNextRouter} from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useTransition } from 'react';
import {useNavigationStore} from "@/store/navigationStore";

export function useNavigatingRouter() {
    const router = useNextRouter();
    const pathname = usePathname();
    const { setIsNavigating } = useNavigationStore();
    const [isPending, startTransition] = useTransition();

    const currentLang = pathname.split("/")[1] || "en";

    useEffect(() => {
        if (!isPending) {
            const timer = setTimeout(() => {
                setIsNavigating(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isPending, setIsNavigating]);

    const handleNavigate = useCallback((href: string, method: 'push' | 'replace') => {
        setIsNavigating(true);
        startTransition(() => {
            const finalHref = href.startsWith(`/${currentLang}/`) ? href : `/${currentLang}${href}`;
            router[method](finalHref);
        });
    }, [router, setIsNavigating, startTransition, currentLang]);

    const push = useCallback((href: string) => {
        handleNavigate(href, 'push');
    }, [handleNavigate]);

    const replace = useCallback((href: string) => {
        handleNavigate(href, 'replace');
    }, [handleNavigate]);

    const replaceLanguage = useCallback((newLang: string) => {
        setIsNavigating(true);
        startTransition(() => {
            const pathSegments = pathname.split('/').filter(Boolean)
            if (pathSegments.length > 0 && pathSegments[0].length === 2) {
                pathSegments[0] = newLang;
            } else {
                pathSegments.unshift(newLang);
            }
            const newPath = '/' + pathSegments.join('/');
            router.push(newPath);
        })
    }, [router, pathname, setIsNavigating, startTransition])

    return {
        ...router,
        push,
        replace,
        replaceLanguage,
        pathname,
        currentLang
    };
}