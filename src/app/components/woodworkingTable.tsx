import React, { memo } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { CheckBox, Delete, ShoppingCart } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useStore } from "../store/useStore";

interface Product {
  code: string;
  shape: string;
  dimensions: string;
  images: string;
}

interface ProductTableProps {
  products: Product[];
  isCartView?: boolean;
}

const WoodTable: React.FC<ProductTableProps> = memo(
  ({ products, isCartView }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { cart, addToCart, removeFromCart, signed } = useStore();

    const isInCart = (code: string) => {
      return cart.some((item) => item.code === code);
    };

    const handleToggleCart = (product: Product) => {
      if (!signed) {
        enqueueSnackbar("you must to authorize", {
          variant: "error",
        });
        return;
      }

      if (isInCart(product.code)) {
        removeFromCart(product.code);
        enqueueSnackbar("Removed from cart", { variant: "info" });
      } else {
        addToCart({
          code: product.code,
          shape: product.shape,
          dimensions: product.dimensions,
          images: product.images,
        });
        enqueueSnackbar("Added to cart", { variant: "success" });
      }
    };

    return (
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={`product-${index}-${product.code}`}
          >
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

                <Box sx={{ display: "flex", mt: "auto" }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCart(product);
                    }}
                    sx={(theme) => ({
                      bgcolor: isCartView
                        ? theme.palette.error.main
                        : isInCart(product.code)
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      color: theme.palette.common.white,
                      "&:hover": {
                        bgcolor: isCartView
                          ? theme.palette.error.dark
                          : isInCart(product.code)
                          ? theme.palette.success.dark
                          : theme.palette.error.dark,
                      },
                      width: 35,
                      height: 35,
                    })}
                  >
                    {isCartView ? (
                      <Delete />
                    ) : isInCart(product.code) ? (
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
