"use client";

import React, {useEffect, useRef, useState} from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  MobileStepper,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import {useSnackbar} from "notistack";
import {Field, Form, Formik} from "formik";
import ProductsTable from "@/components/common/productsTable";
import {useCartStore} from "@/features/cart/store";
import {OrderFormData, OrderFormSchema} from "@/types/order";
import {useAuthStore} from "@/features/auth/store";

const OrderForm: React.FC = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  const { cart, fetchCart } = useCartStore();
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
  const formRef = useRef<any>(null);
  const { initializing } = useAuthStore();

  useEffect(() => {
    if (!initializing) {
      void fetchCart();
    }
  }, [initializing]);

  useEffect(() => {
    let count = 0;

    cart.forEach(() => {
      count += 1;
    });

    setTotalItems(count);
  }, [cart]);

  const handleNext = () => {
    if (activeStep === 2 && formRef.current) {
      const formikInstance = formRef.current;
      const hasErrors = Object.keys(formikInstance.errors).length > 0;
      const currentValues = formikInstance.values;
      const allFilled = Object.values(currentValues).every((val) => val !== "");

      if (!hasErrors && allFilled) {
        setFormData(currentValues);
        setActiveStep((prev) => prev + 1);
      } else {
        enqueueSnackbar("Please fill in all the required fields", {
          variant: "error",
        });

        Object.keys(formData).forEach((field) => {
          formikInstance.setFieldTouched(field, true, false);
        });
        formikInstance.validateForm();
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

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
                  <ProductsTable products={cart.map(item => item.product)} isCartView />
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
                    innerRef={formRef}
                    onSubmit={() => {}}
                >
                  {({ values, handleChange, errors, touched }) => (
                      <Form>
                        <Grid container spacing={2}>
                          <Grid xs={12} sm={6}>
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
                          <Grid xs={12} sm={6}>
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

                          <Grid xs={12} sm={6}>
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
                          <Grid xs={12} sm={6}>
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

                          <Grid xs={12}>
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

                          <Grid xs={12}>
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

                          <Grid xs={12}>
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
                        </Grid>
                      </Form>
                  )}
                </Formik>
              </Paper>
          )}

          {/* ORDER SUMMARY BLOCK */}
          {activeStep === 3 && (
              <Grid xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6">Order Summary</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1">
                    Total: {totalItems} {cart.length > 1 ? "items" : "item"}
                  </Typography>
                  <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "text.secondary" }}
                  >
                    Delivery cost according to carrier rates
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