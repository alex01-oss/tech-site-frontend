import React from 'react'
import {Container, Typography} from "@mui/material";

export default function Page() {
    return (
        <Container sx={{minHeight: '100vh', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
            <Typography>Categories editor</Typography>
        </Container>
    )
}
