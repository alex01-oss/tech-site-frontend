import React from 'react'
import ProductDetailPage from "@/components/layout/ProductDetailPage";
import {catalogApi} from "@/features/catalog/api";
import {ProductDetailData} from "@/features/catalog/types";

export default async function CatalogItemPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);

    let productData: ProductDetailData | undefined = undefined;
    try {
        productData = await catalogApi.fetchCatalogItem(id);
    } catch (e) {
        console.error("Failed to fetch product data on server:", e);
    }

    return (
        <ProductDetailPage
            initialProductData={productData}
            productId={id}
        />
    );
}
