import { enqueueSnackbar } from 'notistack';

export const useAuthErrors = () => {
    const handleAuthError = (error: any) => {
        const errorMessages = {
            400: "Required fields are missing",
            401: "Invalid email or password",
            404: "User not found, please register",
            409: "User with this email already exists. Please sign in.",
            500: "Server error. Please try again later.",
        };

        const status = error.status || error.response?.status;
        const message =
            errorMessages[status as keyof typeof errorMessages] ||
            error.message ||
            "Unexpected error";

        enqueueSnackbar(message, { variant: "error" });
    };

    return { handleAuthError };
};