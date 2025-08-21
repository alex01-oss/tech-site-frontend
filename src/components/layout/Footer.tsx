"use client";

import React, {useEffect, useState} from "react";
import {Box, Container, IconButton, Link, Paper, Typography, useTheme} from "@mui/material";
import {socialLinks} from "@/constants/socialLinks";
import {FooterDict} from "@/types/dict";

export const Footer: React.FC<{ dict: FooterDict }> = ({ dict }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const theme = useTheme();

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <Paper
            component="footer"
            sx={{
                p: { xs: 2, sm: 3 },
                backgroundImage: "none",
                mt: 'auto',
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: theme.spacing(2),
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h6" sx={{ mb: { xs: 1, md: 2 }, fontWeight: 600 }}>
                            POLTAVA SUPERABRASIVES
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                maxWidth: '40ch',
                                mx: "auto",
                                lineHeight: 1.5,
                            }}
                        >
                            {dict.tagline}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: theme.spacing(1)
                    }}>
                        {socialLinks.map((social, index) => {
                            const IconComponent = social.icon;
                            return (
                                <Link
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="inherit"
                                >
                                    <IconButton
                                        sx={{
                                            border: "1px solid",
                                            borderColor: "divider",
                                            "&:hover": {
                                                color: social.hoverColor,
                                                borderColor: social.hoverColor,
                                            },
                                        }}
                                        color="inherit"
                                    >
                                        <IconComponent />
                                    </IconButton>
                                </Link>
                            );
                        })}
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ textAlign: "center" }}>
                            <Link
                                href="https://pdt.tools/"
                                underline="none"
                                sx={{ fontWeight: 500, color: 'inherit' }}
                            >
                                {dict.companyName}.
                            </Link>
                            <br />
                            {dict.copyright} {year}.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Paper>
    );
}