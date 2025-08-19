"use client"

import React, {useEffect, useRef, useState} from "react";
import {Field, Form, Formik} from "formik";
import {
    Alert,
    Box,
    Button,
    Container,
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
import {ProductsTable} from "@/components/catalog/ProductsTable";
import {useCartStore} from "@/features/cart/store";
import {useAuthStore} from "@/features/auth/store";
import {OrderFormSchema, OrderFormValues} from "@/types/order";
import {CartDict, ProductCardDict} from "@/types/dict";

interface Props {
    dict: {
        cart: CartDict,
        productCard: ProductCardDict
    },
}

export const OrderForm: React.FC<Props> = ({dict}) => {
    const [activeStep, setActiveStep] = useState(0);
    const {cart, fetchCart, error} = useCartStore();
    const {user, initializing} = useAuthStore();
    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme();

    const formikRef = useRef<any>(null);

    useEffect(() => {
        if (!initializing) void fetchCart()
    }, [initializing]);

    useEffect(() => {
        if (!initializing) {
            void fetchCart();
        }
    }, [initializing, fetchCart]);

    const handleNext = async () => {
        if (activeStep === 1 && formikRef.current) {
            const formikInstance = formikRef.current;
            const errors = await formikInstance.validateForm();
            formikInstance.setTouched(Object.keys(errors).reduce((acc, curr) => ({...acc, [curr]: true}), {}));

            if (Object.keys(errors).length === 0) {
                formikInstance.submitForm();
                setActiveStep((prev) => prev + 1);
            } else {
                enqueueSnackbar(dict.cart.emptyField, {variant: "error"});
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const initialFormValues: OrderFormValues = {
        name: user?.full_name.split(" ")[0] || "",
        surname: user?.full_name.split(" ")[1] || "",
        phoneNumber: user?.phone || "",
        email: user?.email || "",
        address: "",
        deliveryMethod: "standard",
        paymentMethod: "cashOnDelivery",
    };

    if (error) {
        return (
            <Container maxWidth="lg" sx={{
                mt: 12,
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Alert severity="error">Loading cart error: {error}</Alert>
            </Container>
        );
    }

    const renderStepContent = (step: number) => {
        const formFields = [
            {name: "name", label: dict.cart.name},
            {name: "surname", label: dict.cart.surname},
            {name: "phoneNumber", label: dict.cart.phone},
            {name: "email", label: dict.cart.email},
            {name: "address", label: dict.cart.address, fullWidth: true},
        ];

        switch (step) {
            case 0:
                return cart.length === 0 ? (
                    <Typography variant="h6" sx={{textAlign: "center", color: "text.secondary"}}>
                        {dict.cart.emptyMessage}
                    </Typography>
                ) : (
                    <ProductsTable products={cart.map((item) => item.product)} isCartView dict={dict.productCard}/>
                );
            case 1:
                return (
                    <Paper sx={{p: 3, borderRadius: 2}}>
                        <Typography variant="h5" sx={{mb: 2}}>
                            {dict.cart.placing}
                        </Typography>
                        <Formik
                            initialValues={initialFormValues}
                            validationSchema={OrderFormSchema}
                            innerRef={formikRef}
                            onSubmit={(values) => {
                                console.log(values);
                            }}
                        >
                            {({values, handleChange, errors, touched}) => (
                                <Form>
                                    <Grid container spacing={{xs: 2, sm: 3}}>
                                        {formFields.map((fieldProps) => (
                                            <Grid item xs={12} sm={fieldProps.fullWidth ? 12 : 6}
                                                  key={fieldProps.name}>
                                                <Field
                                                    as={TextField}
                                                    fullWidth
                                                    label={fieldProps.label}
                                                    variant="outlined"
                                                    name={fieldProps.name}
                                                    value={values[fieldProps.name as keyof OrderFormValues]}
                                                    onChange={handleChange}
                                                    error={touched[fieldProps.name as keyof OrderFormValues] && Boolean(errors[fieldProps.name as keyof OrderFormValues])}
                                                    helperText={touched[fieldProps.name as keyof OrderFormValues] && errors[fieldProps.name as keyof OrderFormValues]}
                                                />
                                            </Grid>
                                        ))}

                                        <Grid item xs={12}>
                                            <FormControl fullWidth required>
                                                <InputLabel>{dict.cart.deliveryMethod}</InputLabel>
                                                <Select
                                                    label={dict.cart.deliveryMethod}
                                                    name="deliveryMethod"
                                                    value={values.deliveryMethod}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="standard">{dict.cart.standard}</MenuItem>
                                                    <MenuItem value="express">{dict.cart.express}</MenuItem>
                                                    <MenuItem value="pickup">{dict.cart.pickup}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormControl fullWidth required>
                                                <FormLabel>{dict.cart.payment}</FormLabel>
                                                <RadioGroup
                                                    name="paymentMethod"
                                                    value={values.paymentMethod}
                                                    onChange={handleChange}
                                                >
                                                    <FormControlLabel value="cashOnDelivery" control={<Radio/>}
                                                                      label={dict.cart.cashOnDelivery}/>
                                                    <FormControlLabel value="payNow" control={<Radio/>}
                                                                      label={dict.cart.payNow}/>
                                                    <FormControlLabel value="installments" control={<Radio/>}
                                                                      label={dict.cart.installments}/>
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    </Paper>
                );
            case 2:
                return (
                    <Grid item xs={12} md={4}>
                        <Paper sx={{p: 3, borderRadius: 2}}>
                            <Typography variant="h6">{dict.cart.summary}</Typography>
                            <Divider sx={{my: 2}}/>
                            <Typography
                                variant="body1">{dict.cart.total} {cart.length} {cart.length > 1 ? dict.cart.itemsPlural : dict.cart.itemsSingular}</Typography>
                            <Typography variant="body2" sx={{mt: 1, color: "text.secondary"}}>
                                {dict.cart.deliveryCost}
                            </Typography>
                            <Typography variant="caption" sx={{mt: 2, display: "block"}}>
                                {dict.cart.agreement}
                            </Typography>
                            <Typography variant="caption" sx={{color: "primary.main", cursor: "pointer"}}>
                                {dict.cart.privacyPolicy} {dict.cart.and} {dict.cart.termsOfService}
                            </Typography>
                            <Button variant="contained" color="primary" fullWidth sx={{mt: 2}}
                                    aria-label={dict.cart.cta}>
                                {dict.cart.cta}
                            </Button>
                        </Paper>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Box>
            <MobileStepper
                variant="progress"
                steps={3}
                position="static"
                activeStep={activeStep}
                sx={{maxWidth: 400, flexGrow: 1, margin: "auto", mb: {xs: 1, sm: 2}}}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === 2}
                        aria-label={dict.cart.next}
                    >
                        {dict.cart.next}
                        {theme.direction === "rtl" ? (<KeyboardArrowLeft/>) : (<KeyboardArrowRight/>)}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0} aria-label={dict.cart.back}>
                        {theme.direction === "rtl" ? (<KeyboardArrowRight/>) : (<KeyboardArrowLeft/>)}
                        {dict.cart.back}
                    </Button>
                }
            />
            <Box>{renderStepContent(activeStep)}</Box>
        </Box>
    );
};