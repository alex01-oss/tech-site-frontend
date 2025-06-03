import { Delete, CheckBox, ShoppingCart } from "@mui/icons-material";
import { Grid, Box, Typography, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import { memo } from "react";
import { useStore } from "../store/useStore";

interface Product {
  code: string;
  shape: string;
  dimensions: string;
  images: string;
  is_in_cart?: boolean;
}

interface ProductTableProps {
  products: Product[];
  isCartView?: boolean;
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
}

const WoodTable: React.FC<ProductTableProps> = memo(
  ({ products, isCartView = false, setProducts }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { signed, addToCart, removeFromCart } = useStore();

    const handleToggleCart = (product: Product) => {
      if (!signed) {
        enqueueSnackbar("You must be logged in", { variant: "error" });
        return;
      }

      if (product.is_in_cart) {
        removeFromCart(product.code);
        enqueueSnackbar("Removed from cart", { variant: "info" });

        if (isCartView && setProducts) {
          setProducts(products.filter(p => p.code !== product.code));
        } else if (setProducts) {
          setProducts(products.map(p =>
            p.code === product.code ? { ...p, is_in_cart: false } : p
          ));
        }
      } else {
        addToCart(product.code);
        enqueueSnackbar("Added to cart", { variant: "success" });

        if (setProducts) {
          setProducts(products.map(p =>
            p.code === product.code ? { ...p, is_in_cart: true } : p
          ));
        }
      }
    };

    return (
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`product-${index}`}>
            <Box
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                borderRadius: 1,
                bgcolor: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
                transition: theme.transitions.create(
                  ["transform", "box-shadow"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                overflow: "hidden",
                height: "100%",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[4],
                },
              })}
            >
              {/* IMAGE */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 100,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`http://localhost:8080/${product.images}`}
                    alt={product.shape}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>

              {/* CONTENT */}
              <Box
                sx={{
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                <Typography variant="body2">Shape:</Typography>
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                  {product.shape}
                </Typography>

                <Typography variant="body2">Dimensions:</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {product.dimensions}
                </Typography>

                {/* CART BUTTON */}
                <Box sx={{ display: "flex", mt: "auto" }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCart(product);
                    }}
                    sx={(theme) => ({
                      bgcolor: isCartView
                        ? theme.palette.error.main
                        : product.is_in_cart
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      color: theme.palette.common.white,
                      "&:hover": {
                        bgcolor: isCartView
                          ? theme.palette.error.dark
                          : product.is_in_cart
                          ? theme.palette.success.dark
                          : theme.palette.error.dark,
                      },
                      width: 35,
                      height: 35,
                    })}
                  >
                    {isCartView ? (
                      <Delete />
                    ) : product.is_in_cart ? (
                      <CheckBox />
                    ) : (
                      <ShoppingCart />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
);

WoodTable.displayName = "WoodTable";
export default WoodTable;
