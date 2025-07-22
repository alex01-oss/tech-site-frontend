import {CatalogItem} from "@/features/catalog/types";
import {useSnackbar} from "notistack";
import {useCartStore} from "@/features/cart/store";
import {useAuthStore} from "@/features/auth/store";

export const useToggleCart = () =>{
    const { enqueueSnackbar } = useSnackbar();
    const { toggleCartItem, isInCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();


    const handleToggleCart = async (product: CatalogItem) => {
        if (!isAuthenticated) {
            enqueueSnackbar("You must be logged in", { variant: "error" });
            return;
        }

        try {
            await toggleCartItem(product);
            enqueueSnackbar(
                isInCart(product.code) ? "Added to cart" : "Removed from cart",
                { variant: isInCart(product.code) ? "success" : "info" }
            );
        } catch {
            enqueueSnackbar("Error updating cart", { variant: "error" });
        }
    };

    return { handleToggleCart, isInCart }
}
