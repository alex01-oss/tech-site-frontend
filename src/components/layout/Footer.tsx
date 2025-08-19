"use client";

import React, {useEffect, useState} from "react";
import {Box, Container, Divider, Grid, IconButton, Link, Paper, Typography, useTheme,} from "@mui/material";
import {Facebook, Instagram, LinkedIn, X, YouTube} from "@mui/icons-material";
import {socialLinks} from "@/constants/socialLinks";


interface Props {
    dict: {
        tagline: string,
        companyName: string,
        copyright: string,
    }
}

export const Footer: React.FC<Props> = ({ dict } ) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const theme = useTheme();

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <Paper
            component="footer"
            sx={{
                p: {xs: 2, sm: 3},
                borderTop: "1px solid rgba(142, 32, 65, 0.1)",
                boxShadow: theme.shadows[2],
                backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#383E45",
                color: "#FFF",
                backgroundImage: "none",
                mt: 'auto',
            }}
        >
            <Container maxWidth="xl">
                <Grid container justifyContent="center" alignItems="center" flexDirection="column" spacing={2}>
                    <Grid item xs={12} md={8} lg={6}>
                        <Box sx={{textAlign: "center"}}>
                            <Typography variant="h6" sx={{mb: {xs: 1, md: 2}, fontWeight: 600}}>
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
                    </Grid>

                    <Grid item xs={12}>
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
                                            <IconComponent/>
                                        </IconButton>
                                    </Link>
                                );
                            })}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{textAlign: "center"}}>
                            <Link
                                href="https://pdt.tools/"
                                underline="none"
                                sx={{fontWeight: 500, color: 'inherit'}}
                            >
                                {dict.companyName}.
                            </Link>
                            <br/>
                            {dict.copyright} {year}.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Paper>
    );
}