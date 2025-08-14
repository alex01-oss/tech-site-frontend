'use client';

import {createContext, useContext, ReactNode, useState} from 'react';

interface LayoutContextType {
    hasTopMargin: boolean;
    setHasTopMargin: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({children}: { children: ReactNode }) {
    const [hasTopMargin, setHasTopMargin] = useState(true);

    return (
        <LayoutContext.Provider value={{hasTopMargin, setHasTopMargin}}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) throw new Error('useLayout must be used within LayoutProvider');
    return context;
}