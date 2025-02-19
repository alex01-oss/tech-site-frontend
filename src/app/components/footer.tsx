"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Container, Typography, IconButton, Link } from "@mui/material";
import { Facebook, Instagram, YouTube, LinkedIn, X } from "@mui/icons-material";

const socialLinks = [
  {
    icon: Facebook,
    url: "https://www.facebook.com/superabrasives.tools",
    hoverColor: "#4267B2",
  },
  {
    icon: Instagram,
    url: "https://www.instagram.com/pdtools/",
    hoverColor: "#E1306C",
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
  { icon: X, url: "https://x.com/PDT73640376", hoverColor: "#657786" },
];

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <Box
      sx={{
        borderTop: "1px solid #BDBDBD",
        padding: "16px",
        backgroundColor: "#F5F6FA",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        zIndex: 20000,
      }}
    >
      <Container maxWidth="xl" sx={{ textAlign: "center" }}>
        {/* Logo */}
        <Link href="#" sx={{ display: "inline-block" }}>
          <Image src="/logo_gray.svg" alt="logo" width={200} height={80} />
        </Link>

        {/* Slogan */}
        <Typography variant="body1" sx={{ color: "#47536B", fontWeight: 400 }}>
          Traditions of Quality since 1966
        </Typography>

        {/* Social Media Icons */}
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
                    color: "#47536B",
                  }}
                >
                  <IconComponent sx={{ fontSize: 32 }} />
                </IconButton>
              </Link>
            );
          })}
        </Box>

        {/* Copyright */}
        <Typography
          variant="body2"
          sx={{ color: "#47536B", textDecoration: "none" }}
        >
          <Link
            href="https://pdt.tools/"
            underline="none"
            sx={{ color: "#47536B", ":hover": { color: "#8C2648" } }}
          >
            PJSC &quot;POLTAVA DIAMOND TOOLS&quot;
          </Link>
          . © Copyright {year}.
        </Typography>
      </Container>
    </Box>
  );
}
