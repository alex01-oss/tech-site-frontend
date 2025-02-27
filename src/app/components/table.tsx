import React, { memo } from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import CustomImage from "./image";
import useTileHeight from "../hooks/useTileHeight";

interface Product {
  Title: string;
  Price: number;
  Currency: string;
  Images: string;
}

interface ProductTableProps {
  products: Product[];
  tileHeight: string;
}

const ProductTable: React.FC<ProductTableProps> = memo(({ products }) => {
  const tileHeight = useTileHeight();
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
                <Box sx={{ minWidth: { xs: "40px", sm: "50px" }, mr: 2 }}>
                  <CustomImage
                    src={product.Images?.split(",")[0].trim()}
                    alt="product"
                    width={40}
                    height={40}
                  />
                </Box>

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
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
});

ProductTable.displayName = "ProductTable";

export default ProductTable;
