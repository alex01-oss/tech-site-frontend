import React from 'react'
import ProductDetailPage from "@/components/catalog/ProductDetailPage";
import {catalogApi} from "@/features/catalog/api";
import {ProductDetailData} from "@/features/catalog/types";
import {getDictionary} from "@/lib/i18n";

interface Props {
    params: {
        id: string,
        lang: string
    }
}

export default async function CatalogItemPage({params: {id, lang}}: Props) {
    const product_id = parseInt(id, 10);
    const dict = await getDictionary(lang);
    let productData: ProductDetailData | null = null;
    let error: string | null = null;

    try {
        const fetchedData = await catalogApi.fetchCatalogItem(product_id);
        if (!fetchedData) error = "Product not found."
        else productData = fetchedData
    } catch (e) {
        console.error("Failed to fetch product data on server:", e);
        error = e instanceof Error ? e.message : "Failed to load product data.";
    }

    return (
        <ProductDetailPage
            initialProductData={productData}
            initialError={error}
            dict={dict.catalog.details}
        />
    );
}