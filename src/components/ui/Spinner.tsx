import {Box, CircularProgress} from "@mui/material";

export default function Spinner({ dict }: { dict: { loading: string } }) {
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
            <CircularProgress aria-label={dict.loading} />
        </Box>
    );
}