import React from 'react'
import ProductDetailPage from "@/components/catalog/ProductDetailPage";
import {catalogApi} from "@/features/catalog/api";
import {ProductDetailData} from "@/features/catalog/types";

export default async function CatalogItemPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    let productData: ProductDetailData | null = null;
    let error: string | null = null;

    try {
        const fetchedData = await catalogApi.fetchCatalogItem(id);
        if (!fetchedData) {
            error = "Product not found.";
        } else {
            productData = fetchedData;
        }
    } catch (e) {
        console.error("Failed to fetch product data on server:", e);
        error = e instanceof Error ? e.message : "Failed to load product data.";
    }

    return (
        <ProductDetailPage
            initialProductData={productData}
            initialError={error}
            productId={id}
        />
    );
}