import React from "react";
import {getDictionary} from '@/lib/i18n';
import {CatalogPage} from "@/components/catalog/CatalogPage";

export default async function Page({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang);

    return (
        <CatalogPage dict={{
            catalog: dict.catalog,
            productCard: dict.productCard,
            titles: dict.categoriesSection.titles
        }} />
    );
}