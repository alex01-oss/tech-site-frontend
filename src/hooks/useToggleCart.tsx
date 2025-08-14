import {useSnackbar} from "notistack";
import {useCartStore} from "@/features/cart/store";
import {useAuthStore} from "@/features/auth/store";
import {Button} from "@mui/material";
import React from "react";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";

export const useToggleCart = () => {
    const {enqueueSnackbar} = useSnackbar();
    const {toggleCartItem, isInCart} = useCartStore();
    const {isAuthenticated} = useAuthStore();
    const router = useNavigatingRouter()

    const handleToggleCart = async (id: number) => {
        if (!isAuthenticated) {
            enqueueSnackbar(
                "You must be logged in", {
                    variant: "error",
                    action: <Button color="inherit" size="small" onClick={() => router.push("/login")}>Login</Button>
                });
            return;
        }

        try {
            await toggleCartItem(id);
            enqueueSnackbar(
                isInCart(id) ? "Added to cart" : "Removed from cart",
                {variant: isInCart(id) ? "success" : "info"}
            );
        } catch {
            enqueueSnackbar("Error updating cart", {variant: "error"});
        }
    };

    return {handleToggleCart, isInCart}
}
