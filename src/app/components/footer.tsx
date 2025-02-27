"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { Box, Container, Typography, IconButton, Link } from "@mui/material";
import { Facebook, Instagram, YouTube, LinkedIn, X } from "@mui/icons-material";
import { useThemeContext } from "../context/context";

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
  const theme = useTheme();
  const [year, setYear] = useState(new Date().getFullYear());

  const { mode } = useThemeContext();
  const isDark = mode === "dark";

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <Box
      sx={{
        borderTop: "1px solid rgba(78, 12, 30, 0.2)",
        padding: "16px",
        backgroundColor: theme.palette.mode === "light" ? "#FFFFFF" : "#1E1E1E",
        color: theme.palette.text.secondary,
        zIndex: 20000,
      }}
    >
      <Container maxWidth="xl" sx={{ textAlign: "center" }}>
        <Link href="#" sx={{ display: "inline-block" }}>
          <Image
            src={isDark ? "/logo_gray_light.svg" : "/logo_gray.svg"}
            alt="logo"
            width={150}
            height={60}
          />
        </Link>

        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Traditions of Quality since 1966
        </Typography>

        <Box sx={{ margin: "4px" }}>
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <Link
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ margin: "4px" }}
              >
                <IconButton
                  sx={{
                    "&:hover": { color: social.hoverColor },
                    color: "text.secondary",
                  }}
                >
                  <IconComponent sx={{ fontSize: 32 }} />
                </IconButton>
              </Link>
            );
          })}
        </Box>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <Link
            href="https://pdt.tools/"
            underline="none"
            sx={{
              color: "text.secondary",
              ":hover": { color: "primary.main" },
            }}
          >
            PJSC &quot;POLTAVA DIAMOND TOOLS&quot;
          </Link>
          . © Copyright {year}.
        </Typography>
      </Container>
    </Box>
  );
}
