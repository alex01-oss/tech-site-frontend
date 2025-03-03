"use client";

import * as React from "react";
import { Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AccountMenuProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  setUser: React.Dispatch<
    React.SetStateAction<{ name: string; avatar?: string } | null>
  >;
}

export default function AccountMenu({
  anchorEl,
  handleClose,
  setUser,
}: AccountMenuProps) {
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [signed, setSigned] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setSigned(false);
    setUser(null);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
      setSigned(true);
    } else {
      setSigned(false);
    }
  }, []);

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
          <MenuItem onClick={() => router.push("/login")}>
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
