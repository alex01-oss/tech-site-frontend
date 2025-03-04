"use client";

import * as React from "react";
import { Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { useSnackbar } from "notistack";

interface AccountMenuProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
}

export default function AccountMenu({
  anchorEl,
  handleClose,
}: AccountMenuProps) {
  const open = Boolean(anchorEl);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { user, logout, signed, checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    checkAuth();
    handleClose();
    enqueueSnackbar("you are logged out");
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {signed ? (
          <MenuItem onClick={() => router.push("/profile/id")}>
            <AccountCircleIcon sx={{ mr: 1.5 }} /> Profile{" "}
          </MenuItem>
        ) : (
          <MenuItem onClick={() => router.push("/auth/login")}>
            <AccountCircleIcon sx={{ mr: 1.5 }} /> Sign in
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => router.push("/settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        {signed && (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
