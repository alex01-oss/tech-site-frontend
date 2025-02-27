"use client";

import {
  AppBar,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Divide as Hamburger } from "hamburger-react";
import Image from "next/image";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../context/context";

interface NavbarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isOpen, setOpen }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleColorMode } = useThemeContext();
  const isDark = mode === "dark";

  return (
    <AppBar
      sx={{
        background: theme.palette.background.paper,
        boxShadow: "none",
        borderBottom: `1px solid ${
          isDark ? "rgba(255, 96, 144, 0.2)" : "rgba(78, 12, 30, 0.2)"
        }`,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 60,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile ? (
            <Hamburger
              toggled={isOpen}
              toggle={() => setOpen(!isOpen)}
              color={isDark ? "#FF6090" : "#8E2041"}
              rounded
            />
          ) : (
            <Box
              component="a"
              href="https://pdt.tools/"
              sx={{
                pr: 6,
                width: 255,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={isDark ? "/logo_red_light.svg" : "/logo_red.svg"}
                alt="logo"
                width={125}
                height={50}
              />
            </Box>
          )}
        </Box>

        <Tooltip
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <IconButton
            onClick={toggleColorMode}
            color="inherit"
            sx={{
              color: isDark ? "#FF6090" : "#8E2041",
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(255, 96, 144, 0.1)"
                  : "rgba(142, 32, 65, 0.1)",
              },
            }}
          >
            {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
