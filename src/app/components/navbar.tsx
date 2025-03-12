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
  Badge,
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
import { usePathname, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useStore } from "../store/useStore";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleColorMode } = useThemeContext();
  const isDark = mode === "dark";
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { isOpen, setOpen, signed, user, cart } = useStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => setAnchorEl(null);

  const cartCount = cart.reduce(
    // (acc, item) => acc + item.quantity,
    (acc) => acc + 1,
    0
  );
  const pathname = usePathname();
  const isRoute = pathname !== "/";

  const iconButtonStyles = {
    color: isDark ? "#FF6090" : "#8E2041",
    "&:hover": {
      backgroundColor: isDark
        ? "rgba(255, 96, 144, 0.1)"
        : "rgba(142, 32, 65, 0.1)",
    },
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const renderLogoAndBackButton = () => (
    <Box
      component="a"
      onClick={() => router.push("/")}
      sx={{
        pr: 6,
        width: 255,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Image
        src={isDark ? "/logo_red_light.svg" : "/logo_red.svg"}
        alt="logo"
        width={125}
        height={50}
      />
      {isRoute && (
        <IconButton
          color="inherit"
          onClick={() => router.push("/")}
          sx={{
            ...iconButtonStyles,
            position: "absolute",
            ml: 32,
          }}
        >
          <ArrowBackIcon sx={{ color: isDark ? "#FF6090" : "#8E2041" }} />
        </IconButton>
      )}
    </Box>
  );

  const renderMobileMenu = () => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {isRoute ? (
        <IconButton
          color="inherit"
          sx={{ ...iconButtonStyles }}
          onClick={() => router.push("/")}
        >
          <ArrowBackIcon />
        </IconButton>
      ) : (
        <Hamburger
          toggled={isOpen}
          toggle={() => setOpen(!isOpen)}
          color={isDark ? "#FF6090" : "#8E2041"}
          rounded
        />
      )}
    </Box>
  );

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
        {isMobile ? renderMobileMenu() : renderLogoAndBackButton()}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* THEME TOGGLE */}
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
                  : enqueueSnackbar("You must be authorized", {
                      variant: "error",
                    });
              }}
              color="inherit"
              sx={iconButtonStyles}
            >
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* ACCOUNT */}
          <Tooltip title="Profile" sx={{ mx: 1 }} onClick={handleProfileClick}>
            <Avatar>
              {signed && user?.username
                ? user.username.charAt(0).toUpperCase()
                : ""}
            </Avatar>
          </Tooltip>

          <AccountMenu anchorEl={anchorEl} handleClose={handleClose} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
