"use client";

import React, {useEffect, useState} from "react";
import {Box, Container, Divider, Grid, IconButton, Link, Paper, Typography, useTheme,} from "@mui/material";
import {Facebook, Instagram, LinkedIn, X, YouTube} from "@mui/icons-material";

const socialLinks = [
    {
        icon: Instagram,
        url: "https://www.instagram.com/pdtools/",
        hoverColor: "#E1306C",
    },
    {
        icon: Facebook,
        url: "https://www.facebook.com/superabrasives.tools",
        hoverColor: "#4267B2",
    },
    {
        icon: YouTube,
        url: "https://www.youtube.com/channel/UC3tUVI8r3Bfr8hb9-KzfCvw",
        hoverColor: "#FF0000",
    },
    {
        icon: LinkedIn,
        url: "https://www.linkedin.com/company/pdtoolssuperabrasives",
        hoverColor: "#0077B5",
    },
    {
        icon: X,
        url: "https://x.com/PDT73640376",
        hoverColor: "#657786",
    },
];

export default function Footer() {
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
                                High-quality industrial abrasives for metalworking, grinding, and
                                polishing. Manufactured to international standards.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: {xs: 1, md: 1},
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
                                PJSC &quot;POLTAVA DIAMOND TOOLS&quot;
                            </Link>
                            . © Copyright {year}.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Paper>
    );
}
