'use client'

import * as React from "react";
import {Divider, ListItemIcon, Menu, MenuItem} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useRouter} from "next/navigation";
import {useSnackbar} from "notistack";
import {useAuthStore} from "@/features/auth/store";

interface AccountMenuProps {
    anchorEl: null | HTMLElement;
    handleCloseAction: () => void;
}

export default function AccountMenu({
                                        anchorEl,
                                        handleCloseAction,
                                    }: AccountMenuProps) {
    const open = Boolean(anchorEl);
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const {logout, isAuthenticated, user} = useAuthStore();

    const handleLogout = () => {
        void logout()
        handleCloseAction();
        enqueueSnackbar("you are logged out", {variant: "info"});
        router.push("/");
    };

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleCloseAction}
                onClick={handleCloseAction}
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
                transformOrigin={{horizontal: "right", vertical: "top"}}
                anchorOrigin={{horizontal: "right", vertical: "bottom"}}
            >
                {isAuthenticated ? (
                    <MenuItem onClick={() => router.push("/profile/id")}>
                        <AccountCircleIcon sx={{mr: 1.5}}/> Profile{" "}
                    </MenuItem>
                ) : (
                    <MenuItem onClick={() => router.push("/login")}>
                        <AccountCircleIcon sx={{mr: 1.5}}/> Sign in
                    </MenuItem>
                )}
                <Divider/>
                <MenuItem onClick={() => router.push("/settings")}>
                    <ListItemIcon>
                        <Settings fontSize="small"/>
                    </ListItemIcon>
                    Settings
                </MenuItem>
                {isAuthenticated && (
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small"/>
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}
