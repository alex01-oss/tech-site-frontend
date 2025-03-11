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
  Divider,
  MobileStepper,
  useTheme,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useStore } from "../store/useStore";
import ProductTable from "../components/table";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";

interface OrderFormData {
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  address: string;
  deliveryMethod: string;
  paymentMethod: string;
}

const OrderFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  phoneNumber: Yup.string()
    .matches(/^[+]?[0-9]{10,15}$/, "Invalid phone number")
    .required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string().required("Address is required"),
  paymentMethod: Yup.string().required("Payment method is required"),
  deliveryMethod: Yup.string().required("Delivery method is required"),
});

const OrderForm: React.FC = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [activeStep, setActiveStep] = useState(1);

  const { cart, fetchCart } = useStore();
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    surname: "",
    phoneNumber: "",
    email: "",
    address: "",
    deliveryMethod: "standard",
    paymentMethod: "",
  });

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

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
      total += item.price;
      count += 1;
    });

    setTotalSum(total);
    setTotalItems(count);
  }, [cart]);

  const handleNext = () => {
    if (activeStep === 2) {
      const isFormValid = Object.values(formData).every(
        (value) => value !== ""
      );
      if (!isFormValid) {
        enqueueSnackbar("Please fill in all the required fields", {
          variant: "error",
        });
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev -= 1));
  };

  const steps = ["Products Table", "Customer Details", "Order Summary"];

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 60px)",
        mt: "60px",
        bgcolor: "background.default",
        padding: 2,
      }}
    >
      {/* STEPPER */}
      <MobileStepper
        variant="progress"
        steps={4}
        position="static"
        activeStep={activeStep}
        sx={{ maxWidth: 400, flexGrow: 1, margin: "auto", mb: 1 }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 3}>
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 1}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />

      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {/* CART BLOCK */}
        {activeStep === 1 &&
          (cart.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              Your cart is empty. Add some products to your cart.
            </Typography>
          ) : (
            <ProductTable products={cart} isCartView />
          ))}

        {/* ORDER FORM BLOCK */}
        {activeStep === 2 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Placing an order
            </Typography>
            <Formik
              initialValues={formData}
              validationSchema={OrderFormSchema}
              onSubmit={(values) => {
                enqueueSnackbar("Form submitted successfully", {
                  variant: "success",
                });
                console.log("Form submitted with values:", values);
              }}
            >
              {({ values, handleChange, errors, touched }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Surname"
                        variant="outlined"
                        name="surname"
                        value={values.surname}
                        onChange={handleChange}
                        error={touched.surname && Boolean(errors.surname)}
                        helperText={touched.surname && errors.surname}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Phone number"
                        variant="outlined"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        error={
                          touched.phoneNumber && Boolean(errors.phoneNumber)
                        }
                        helperText={touched.phoneNumber && errors.phoneNumber}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        label="Address"
                        variant="outlined"
                        fullWidth
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Delivery method</InputLabel>
                        <Select
                          label="Delivery method"
                          name="deliveryMethod"
                          value={values.deliveryMethod}
                          onChange={handleChange}
                        >
                          <MenuItem value="standard">
                            Standard delivery
                          </MenuItem>
                          <MenuItem value="express">Express delivery</MenuItem>
                          <MenuItem value="pickup">Self-delivery</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <FormLabel>Payment</FormLabel>
                        <RadioGroup
                          name="paymentMethod"
                          value={values.paymentMethod}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="cashOnDelivery"
                            control={<Radio />}
                            label="Payment upon receipt of goods"
                          />
                          <FormControlLabel
                            value="payNow"
                            control={<Radio />}
                            label="Pay now"
                          />
                          <FormControlLabel
                            value="installments"
                            control={<Radio />}
                            label="Credit and payment in installments"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                      >
                        Submit Order
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        )}

        {/* ORDER SUMMARY BLOCK */}
        {activeStep === 3 && (
          <Grid item xs={12} md={4}>
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
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default OrderForm;
