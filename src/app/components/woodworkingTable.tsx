import React, { memo } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import CustomImage from "./image";
import { Delete, ShoppingCart } from "@mui/icons-material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
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

      isInCart(product.code)
        ? removeFromCart(product.code)
        : addToCart({
            code: product.code,
            shape: product.shape,
            dimensions: product.dimensions,
            images: product.images,
          });
    };

    return (
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid item xs={12} key={`product-${index}-${product.code}`}>
            <Box
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                p: { xs: 1, sm: 1.5 },
                borderRadius: "3px",
                minHeight: 65,
                bgcolor: theme.palette.background.paper,
                boxShadow: "0px 1px 3px rgba(0,0,0,0.12)",
                width: "100%",
              })}
            >
              {/* IMAGE */}
              <Box sx={{ minWidth: { xs: "40px", sm: "50px" }, mx: 1 }}>
                <CustomImage
                  src={`http://localhost:8080/${product.images}`}
                  alt="product"
                  width={40}
                  height={40}
                />
              </Box>

              {/* TITLE */}
              <Box
                sx={{
                  flex: "1 1 auto",
                  display: "flex",
                  flexDirection: { xs: "row", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "medium",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    width: { xs: "60%", sm: "70%" },
                    mr: 1,
                  }}
                >
                  {/* {product.title} */}
                  {product.shape}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: "medium", ml: "auto" }}
                >
                  {product.dimensions}
                </Typography>
              </Box>

              {/* SHOPPING CART */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(), handleToggleCart(product);
                }}
                sx={{
                  cursor: "pointer",
                  ml: 2,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {isCartView ? (
                  <Delete color="error" />
                ) : isInCart(product.code) ? (
                  <CheckBoxIcon sx={{ color: "success.main" }} />
                ) : (
                  <ShoppingCart />
                )}
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
);

WoodTable.displayName = "WoodTable";

export default WoodTable;
