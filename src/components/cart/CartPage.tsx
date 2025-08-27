"use client"

import React, {useEffect, useRef, useState} from "react";
import {Field, Form, Formik} from "formik";
import {
    Alert,
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
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
import {ProductsGrid} from "@/components/catalog/ProductsGrid";
import {useCartStore} from "@/features/cart/store";
import {useAuthStore} from "@/features/auth/store";
import {OrderFormValues} from "@/types/order";
import {useDictionary} from "@/providers/DictionaryProvider";
import {getOrderFormSchema} from "@/utils/validationSchemas";

export const OrderForm = () => {
    const formikRef = useRef<any>(null);
    const dict = useDictionary();
    const [activeStep, setActiveStep] = useState(0);
    const {cart, fetchCart, error} = useCartStore();
    const {user, initializing} = useAuthStore();
    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme();

    useEffect(() => {
        if (!initializing) void fetchCart()
    }, [initializing]);

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
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Alert severity="error">{dict.common.error} {error}</Alert>
            </Box>
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
                        {dict.cart.empty}
                    </Typography>
                ) : (
                    <ProductsGrid products={cart.map((item) => item.product)} isCartView />
                );
            case 1:
                return (
                    <Paper sx={{p: theme.spacing(3), borderRadius: theme.shape.borderRadius * 2}}>
                        <Typography variant="h5" component="h2" sx={{mb: theme.spacing(2)}}>
                            {dict.cart.placing}
                        </Typography>
                        <Formik
                            initialValues={initialFormValues}
                            validationSchema={getOrderFormSchema}
                            innerRef={formikRef}
                            onSubmit={(values) => {
                                console.log(values);
                            }}
                        >
                            {({values, handleChange, errors, touched}) => (
                                <Form>
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
                                            gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)'},
                                        }}
                                    >
                                        {formFields.map((fieldProps) => (
                                            <Box
                                                key={fieldProps.name}
                                                sx={{
                                                    gridColumn: {
                                                        xs: 'span 1',
                                                        sm: fieldProps.fullWidth ? 'span 2' : 'span 1'
                                                    }
                                                }}
                                            >
                                                <Field
                                                    as={TextField}
                                                    fullWidth
                                                    label={fieldProps.label}
                                                    variant="outlined"
                                                    name={fieldProps.name}
                                                    id={`order-form-${fieldProps.name}-input`}
                                                    value={values[fieldProps.name as keyof OrderFormValues]}
                                                    onChange={handleChange}
                                                    error={touched[fieldProps.name as keyof OrderFormValues] && Boolean(errors[fieldProps.name as keyof OrderFormValues])}
                                                    helperText={touched[fieldProps.name as keyof OrderFormValues] && errors[fieldProps.name as keyof OrderFormValues]}
                                                />
                                            </Box>
                                        ))}

                                        <Box sx={{gridColumn: {xs: 'span 1', sm: 'span 2'}}}>
                                            <FormControl fullWidth required>
                                                <InputLabel id="delivery-method-label">
                                                    {dict.cart.delivery.method}
                                                </InputLabel>
                                                <Select
                                                    labelId="delivery-method-label"
                                                    id="delivery-method-select"
                                                    label={dict.cart.delivery.method}
                                                    name="deliveryMethod"
                                                    value={values.deliveryMethod}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="standard">{dict.cart.delivery.standard}</MenuItem>
                                                    <MenuItem value="express">{dict.cart.delivery.express}</MenuItem>
                                                    <MenuItem value="pickup">{dict.cart.delivery.pickup}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>

                                        <Box sx={{gridColumn: {xs: 'span 1', sm: 'span 2'}}}>
                                            <FormControl fullWidth required>
                                                <FormLabel id="payment-method-group-label">{dict.cart.payment.title}</FormLabel>
                                                <RadioGroup
                                                    aria-labelledby="payment-method-group-label"
                                                    name="paymentMethod"
                                                    value={values.paymentMethod}
                                                    onChange={handleChange}
                                                >
                                                    <FormControlLabel
                                                        value="cashOnDelivery"
                                                        control={<Radio/>}
                                                        label={dict.cart.payment.cash}/>
                                                    <FormControlLabel
                                                        value="payNow"
                                                        control={<Radio/>}
                                                        label={dict.cart.payment.payNow}/>
                                                    <FormControlLabel
                                                        value="installments"
                                                        control={<Radio/>}
                                                        label={dict.cart.payment.installments}/>
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Paper>
                );
            case 2:
                return (
                    <Box
                        sx={{
                            flexGrow: 1,
                            flexShrink: 0,
                        }}
                    >
                        <Paper sx={{p: theme.spacing(3), borderRadius: theme.shape.borderRadius * 2}}>
                            <Typography variant="h6" component="h2">{dict.cart.summary.title}</Typography>
                            <Divider sx={{my: theme.spacing(2)}}/>
                            <Typography
                                variant="body1">{dict.cart.summary.total} {cart.length} {cart.length > 1 ? dict.cart.summary.items : dict.cart.summary.item}</Typography>
                            <Typography variant="body2" sx={{mt: theme.spacing(1), color: "text.secondary"}}>
                                {dict.cart.delivery.cost}
                            </Typography>
                            <Typography variant="caption" sx={{mt: theme.spacing(2), display: "block"}}>
                                {dict.cart.agreement}
                            </Typography>
                            <Typography variant="caption" sx={{color: "primary.main", cursor: "pointer"}}>
                                {dict.common.privacyPolicy} {dict.common.and} {dict.common.termsOfUse}
                            </Typography>
                            <Button variant="contained" color="primary" fullWidth sx={{mt: theme.spacing(2)}}
                                    aria-label={dict.cart.cta}>
                                {dict.cart.cta}
                            </Button>
                        </Paper>
                    </Box>
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
                sx={{
                    maxWidth: 400,
                    flexGrow: 1,
                    margin: "auto",
                    mb: {xs: theme.spacing(1), sm: theme.spacing(2)}
                }}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === 2}
                        aria-label={dict.common.next}
                    >
                        {dict.common.next}
                        {theme.direction === "rtl" ? (<KeyboardArrowLeft/>) : (<KeyboardArrowRight/>)}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0} aria-label={dict.common.back}>
                        {theme.direction === "rtl" ? (<KeyboardArrowRight/>) : (<KeyboardArrowLeft/>)}
                        {dict.common.back}
                    </Button>
                }
            />
            <Box>{renderStepContent(activeStep)}</Box>
        </Box>
    );
};