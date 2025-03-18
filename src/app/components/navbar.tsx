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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useThemeContext } from "../context/context";
import AccountMenu from "./accountMenu";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { usePathname, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useStore } from "../store/useStore";
import { Brightness4, Brightness7 } from "@mui/icons-material";

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
      <Image src="/logo_white.svg" alt="logo" width={125} height={50} />
      {isRoute && (
        <IconButton
          color="inherit"
          onClick={() => router.push("/")}
          sx={{
            position: "absolute",
            ml: 32,
          }}
        >
          <ArrowBackIcon sx={{ color: "#E6E7E9" }} />
        </IconButton>
      )}
    </Box>
  );

  const renderMobileMenu = () => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {isRoute ? (
        <IconButton onClick={() => router.push("/")}>
          <ArrowBackIcon />
        </IconButton>
      ) : (
        <Hamburger toggled={isOpen} toggle={() => setOpen(!isOpen)} rounded />
      )}
    </Box>
  );

  return (
    <AppBar>
      <Toolbar
        sx={{
          minHeight: 60,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {isMobile ? renderMobileMenu() : renderLogoAndBackButton()}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton onClick={toggleColorMode} color="inherit">
              {isDark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

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
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile" sx={{ mx: 1 }} onClick={handleProfileClick}>
            <Avatar sx={{ width: 40, height: 40, ml: 1 }}>
              {signed && user?.username
                ? user.username
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w.charAt(0).toUpperCase())
                    .join("")
                : ""}
            </Avatar>
          </Tooltip>

          <AccountMenu anchorEl={anchorEl} handleClose={handleClose} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
