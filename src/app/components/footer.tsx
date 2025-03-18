"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Link,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import { Facebook, Instagram, YouTube, LinkedIn, X } from "@mui/icons-material";

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

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <Paper
      sx={(theme) => ({
        p: 3,
        borderTop: "1px solid rgba(142, 32, 65, 0.1)",
        boxShadow: theme.shadows[2],
        backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#383E45",
        color: "#FFF",
        backgroundImage: "none",
      })}
    >
      <Container maxWidth="xl">
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              POLTAVA SUPERABRASIVES
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 400,
                mx: "auto",
                lineHeight: 1.5,
              }}
            >
              High-quality industrial abrasives for metalworking, grinding, and
              polishing. Manufactured to international standards.
            </Typography>
          </Box>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconButton
                      sx={{
                        mx: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          color: social.hoverColor,
                        },
                      }}
                    >
                      <IconComponent />
                    </IconButton>
                  </Link>
                );
              })}
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ textAlign: "center" }}>
          <Link
            href="https://pdt.tools/"
            underline="none"
            sx={{ fontWeight: 500 }}
          >
            PJSC &quot;POLTAVA DIAMOND TOOLS&quot;
          </Link>
          . © Copyright {year}.
        </Typography>
      </Container>
    </Paper>
  );
}
