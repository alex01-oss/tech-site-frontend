"use client"

import React, {createContext, useContext} from "react";
import {Dict} from "@/lib/i18n";

const DictionaryContext = createContext<Dict | null>(null);

export function useDictionary() {
    const dict = useContext(DictionaryContext);
    if (!dict) throw new Error('Dictionary not initialized');
    return dict;
}

interface Props {
    dict: Dict;
    children: React.ReactNode;
}

export function DictionaryProvider({dict, children}: Props) {
    return (
        <DictionaryContext.Provider value={dict}>
            {children}
        </DictionaryContext.Provider>
    )
}
