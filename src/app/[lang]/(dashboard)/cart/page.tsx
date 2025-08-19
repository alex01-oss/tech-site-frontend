import {getDictionary} from '@/lib/i18n';
import {OrderForm} from "@/components/cart/CartPage";


interface PageProps {
    params: { lang: string };
}

export default async function Page({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);

    return (
        <OrderForm
            dict={{
                cart: dict.cart,
                productCard: dict.productCard
            }}
        />
    );
}