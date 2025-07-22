import React from 'react'
import {notFound} from "next/navigation";
import ProductDetailPage from "@/components/layout/ProductDetailPage";
import {catalogApi} from "@/features/catalog/api";

export default async function CatalogItemPage({params}: { params: { code: string }}) {
    let productData
    try {
        productData = await catalogApi.fetchCatalogItem(params.code);
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
