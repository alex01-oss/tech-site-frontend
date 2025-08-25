"use client"

import {Box, CircularProgress} from "@mui/material";
import {useDictionary} from "@/providers/DictionaryProvider";

export default function Spinner() {
    const dict = useDictionary();

    return (
        <Box
            role="status"
            aria-live="polite"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}
        >
            <CircularProgress aria-label={dict.common.loading} />
        </Box>
    );
}