"use client";
import {useEffect} from "react";
import {useCatalogStore} from "@/features/catalog/store";

export function CatalogInitializer() {
    const {fetchCatalog, currentPage, search, searchType} = useCatalogStore();

    useEffect(() => {
        fetchCatalog().then(() => {
        });
    }, [fetchCatalog, currentPage, search, searchType]);

    return null;
}