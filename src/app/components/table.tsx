import React, { memo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CustomImage from "./image";
import useTileHeight from "../hooks/useTileHeight";
import { ShoppingCart } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSnackbar } from "notistack";
import { fetchData } from "../api/service";

interface Product {
  Article: string;
  Title: string;
  Price: number;
  Currency: string;
  Images: string;
}

interface ProductTableProps {
  products: Product[];
  tileHeight: string;
  signed: boolean;
}

const ProductTable: React.FC<ProductTableProps> = memo(
  ({ products, signed }) => {
    const tileHeight = useTileHeight();
    const [cart, setCart] = useState<Product[]>([]);
    const { enqueueSnackbar } = useSnackbar();

    const addToCart = async (product: Product) => {
      await fetchData("cart", "POST", {
        article: product.Article,
        title: product.Title,
        price: product.Price,
        currency: product.Currency,
      });

      setCart((prevCart) => {
        const isInCart = prevCart.some((item) => item.Title === product.Title);

        if (isInCart) {
          return prevCart.filter((item) => item.Title !== product.Title);
        } else {
          return [...prevCart, product];
        }
      });
    };

    return (
      <Container sx={{ flex: 1, px: 3, pt: 3 }}>
        <Grid container spacing={1.5}>
          {products.map((product, index) => (
            <Grid item xs={12} key={`product-${index}-${product.Title}`}>
              <Paper
                elevation={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: "8px",
                  height: tileHeight,
                  border: "1px solid rgba(142, 32, 65, 0.1)",
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{ display: "flex", width: "100%", alignItems: "center" }}
                >
                  {/* IMAGE */}
                  <Box sx={{ minWidth: { xs: "40px", sm: "50px" }, mr: 2 }}>
                    <CustomImage
                      src={product.Images?.split(",")[0].trim()}
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
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: { xs: "60%", sm: "70%" },
                        mr: 1,
                      }}
                    >
                      {product.Title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "medium", ml: "auto" }}
                    >
                      {product.Price} {product.Currency}
                    </Typography>
                  </Box>

                  {/* SHOPPING CART */}
                  <IconButton
                    onClick={() => {
                      signed
                        ? addToCart(product)
                        : enqueueSnackbar("you must to authorize", {
                            variant: "error",
                          });
                    }}
                    sx={{
                      ml: 2,
                      mr: 1,
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {cart.some((item) => item.Article === product.Article) ? (
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
      </Container>
    );
  }
);

ProductTable.displayName = "ProductTable";

export default ProductTable;
