"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useStore } from "../store/useStore";
import CustomImage from "../components/image";
import StickyBox from "react-sticky-box";

interface OrderFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryMethod: string;
}

const OrderForm: React.FC = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [currency, setCurrency] = useState("USD");

  const { cart, fetchCart, removeFromCart } = useStore();
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryMethod: "standard",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    let total = 0;
    let count = 0;

    if (cart.length > 0) {
      setCurrency(cart[0].currency);
    }

    cart.forEach((item) => {
      total += item.price * item.quantity;
      count += item.quantity;
    });

    setTotalSum(total);
    setTotalItems(count);
  }, [cart]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", formData);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        mt: 8,
        bgcolor: "background.default",
        padding: 2,
      }}
    >
      <Grid container spacing={3}>
        {/* Left Column - Cart and Order Form */}
        <Grid item xs={12} md={8}>
          {/* CART BLOCK */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Shopping Cart
            </Typography>
            <Grid container spacing={2}>
              {cart.map((item: any, index: number) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      minWidth: { xs: "40px", sm: "50px" },
                      // mr: 2,
                    }}
                  >
                    <Box sx={{ minWidth: { xs: "40px", sm: "50px" }, mr: 2 }}>
                      <CustomImage
                        src="/placeholder.svg"
                        alt="product"
                        width={50}
                        height={50}
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                      <Typography variant="body1" sx={{ whiteSpace: "normal" }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2">
                        {item.price} {item.currency}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => removeFromCart(item.article)}>
                      <Delete />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* ORDER FORM BLOCK */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Placing an order
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    name="fullName"
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Surname"
                    variant="outlined"
                    name="surname"
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone number"
                    variant="outlined"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    inputProps={{
                      pattern: "^[+]?[0-9]{10,15}$",
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    type="email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Delivery method</InputLabel>
                    <Select
                      label="Delivery method"
                      name="deliveryMethod"
                      value={formData.deliveryMethod}
                      onChange={() => handleChange}
                    >
                      <MenuItem value="standard">Standard delivery</MenuItem>
                      <MenuItem value="express">Express delivery</MenuItem>
                      <MenuItem value="pickup">Self-delivery</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <StickyBox offsetTop={80} offsetBottom={20}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6">Order Summary</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">
                Total: {totalItems} {cart.length > 1 ? "items" : "item"}
              </Typography>
              <Typography variant="h6">
                {totalSum} {currency}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Delivery cost according to carrier rates
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                To Pay: {totalSum} {currency}
              </Typography>
              <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
                By confirming the order, I accept the conditions:
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "primary.main", cursor: "pointer" }}
              >
                Privacy Policy & Terms of Service
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Confirm Order
              </Button>
            </Paper>
          </StickyBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderForm;
