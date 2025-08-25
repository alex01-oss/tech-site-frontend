export interface OrderFormValues {
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    address: string;
    deliveryMethod: "standard" | "express" | "pickup";
    paymentMethod: "cashOnDelivery" | "payNow" | "installments";
}