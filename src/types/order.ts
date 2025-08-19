import * as Yup from "yup";

export interface OrderFormValues {
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    address: string;
    deliveryMethod: "standard" | "express" | "pickup";
    paymentMethod: "cashOnDelivery" | "payNow" | "installments";
}

export const OrderFormSchema = Yup.object().shape({
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