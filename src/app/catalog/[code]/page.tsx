import React from 'react'
import {notFound} from "next/navigation";
import ProductDetailPage from "@/components/layout/ProductDetailPage";
import {catalogApi} from "@/features/catalog/api";

export default async function CatalogItemPage({params}: { params: { code: string }}) {
    const { code } = await params;
    let productData
    try {
        productData = await catalogApi.fetchCatalogItem(code);
    } catch (e) {
        console.error("Failed to fetch product data:", e)
        notFound()
    }

    return (
        <ProductDetailPage
            productData={productData}
        />
    )
}
