"use client";

import {
  AppBar,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import { Divide as Hamburger } from "hamburger-react";
import Image from "next/image";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useThemeContext } from "../context/context";
import AccountMenu from "./accountMenu";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useStore } from "../store/useStore";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleColorMode } = useThemeContext();
  const isDark = mode === "dark";
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { isOpen, setOpen, signed, user, logout } = useStore();

  const iconButtonStyles = {
    color: isDark ? "#FF6090" : "#8E2041",
    "&:hover": {
      backgroundColor: isDark
        ? "rgba(255, 96, 144, 0.1)"
        : "rgba(142, 32, 65, 0.1)",
    },
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

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
        {/* MENU */}
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

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* THEME */}
          <Tooltip
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              sx={iconButtonStyles}
            >
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          {/* SHOPPING CART */}
          <Tooltip title="Shopping Cart">
            <IconButton
              onClick={() => {
                signed
                  ? router.push("/cart")
                  : enqueueSnackbar("you must to authorize", {
                      variant: "error",
                    });
              }}
              color="inherit"
              sx={iconButtonStyles}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>

          {/* ACCOUNT */}
          <Tooltip title="Profile" sx={{ mx: 1 }} onClick={handleProfileClick}>
            <Avatar>
              {signed && user ? user.name.charAt(0).toUpperCase() : ""}
            </Avatar>
          </Tooltip>

          <AccountMenu anchorEl={anchorEl} handleClose={handleClose} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
