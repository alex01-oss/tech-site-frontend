import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAuthErrors } from '@/hooks/useAuthErrors';

export const useFormHandler = () => {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { handleAuthError } = useAuthErrors();

    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    const handleSuccess = (message: string) => {
        enqueueSnackbar(message, { variant: 'success' });
    };

    const handleError = (message: string, error?: any) => {
        console.error("Form submission error:", error);
        enqueueSnackbar(message, { variant: 'error' });
        handleAuthError(error);
    };

    return {
        loading,
        startLoading,
        stopLoading,
        handleSuccess,
        handleError
    };
};