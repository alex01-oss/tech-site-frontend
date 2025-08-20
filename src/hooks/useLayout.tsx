'use client';

import {usePathname} from "next/navigation";
import {useMemo} from "react";

export function useLayout() {
    const pathname = usePathname();

    const hasTopMargin = useMemo(() => {
        const routesWithoutMargin = ['/catalog']

        return !routesWithoutMargin.some(route => pathname.endsWith(route));
    }, [pathname])

    return {hasTopMargin};
}