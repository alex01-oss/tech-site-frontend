import React from "react";
import {getDictionary} from '@/lib/i18n';
import {CatalogPage} from "@/components/catalog/CatalogPage";

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function Page({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <CatalogPage dict={{
            catalog: dict.catalog,
            productCard: dict.productCard,
            titles: dict.categoriesSection.titles
        }} />
    );
}