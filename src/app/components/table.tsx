import React, { memo } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CustomImage from "./image";
import { Delete, ShoppingCart } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSnackbar } from "notistack";
import { useStore } from "../store/useStore";

interface Product {
  article: string;
  title: string;
  price: number;
  currency: string;
  images: string;
}

interface ProductTableProps {
  products: Product[];
  isCartView?: boolean;
}

const ProductTable: React.FC<ProductTableProps> = memo(
  ({ products, isCartView }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { cart, addToCart, removeFromCart, signed } = useStore();

    const isInCart = (article: string) => {
      return cart.some((item) => item.article === article);
    };

    const handleToggleCart = (product: Product) => {
      if (!signed) {
        enqueueSnackbar("you must to authorize", {
          variant: "error",
        });
        return;
      }

      isInCart(product.article)
        ? removeFromCart(product.article)
        : addToCart({
            article: product.article,
            title: product.title,
            price: product.price,
            currency: product.currency,
            // Quantity: 1,
            images: product.images,
          });
    };

    return (
      <Grid container spacing={1.5}>
        {products.map((product, index) => (
          <Grid item xs={12} key={`product-${index}-${product.title}`}>
            <Paper
              elevation={1}
              sx={{
                display: "flex",
                alignItems: "center",
                p: { xs: 1, sm: 1.5 },
                borderRadius: "8px",
                minHeight: 68,
                border: "1px solid rgba(142, 32, 65, 0.1)",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{ display: "flex", width: "100%", alignItems: "center" }}
              >
                {/* IMAGE */}
                <Box sx={{ minWidth: { xs: "40px", sm: "50px" }, mx: 1 }}>
                  <CustomImage
                    src={product.images?.split(",")[0].trim()}
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
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      width: { xs: "60%", sm: "70%" },
                      mr: 1,
                    }}
                  >
                    {product.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "medium", ml: "auto" }}
                  >
                    {product.price} {product.currency}
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
                    mr: 1,
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {isCartView ? (
                    <Delete color="error" />
                  ) : isInCart(product.article) ? (
                    <CheckCircleIcon sx={{ color: "success.main" }} />
                  ) : (
                    <ShoppingCart />
                  )}
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }
);

ProductTable.displayName = "ProductTable";

export default ProductTable;
