"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Popper,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "../styles/navbar.module.css";
import { fetchMenuData } from "../api/service";

interface MenuData {
  [category: string]: {
    subcategories: {
      [subcategory: string]: {
        types: string[];
      };
    };
  };
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchMenuData()
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error fetching menu data: ", error));
  }, []);

  const handleMenuHover = (
    event: React.MouseEvent<HTMLElement>,
    category: string
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenCategory(category);
  };

  const handleMenuLeave = () => {
    setAnchorEl(null);
    setOpenCategory(null);
  };

  const renderDesktopMenu = () => {
    if (!menuData) return null;

    return Object.keys(menuData).map((category) => (
      <Box
        key={category}
        className={styles.desktopMenuItem}
        onMouseEnter={(e) => handleMenuHover(e, category)}
        onMouseLeave={handleMenuLeave}
      >
        <Typography>{category}</Typography>
        <Popper
          open={openCategory === category}
          anchorEl={anchorEl}
          placement="bottom-start"
          sx={{ zIndex: 1300 }}
        >
          <Paper className={styles.popperPaper}>
            {Object.entries(menuData[category].subcategories).map(
              ([subcat, data]) => (
                <Box key={subcat} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {subcat}:
                  </Typography>
                  <List dense>
                    {data.types.map((type, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={type} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )
            )}
          </Paper>
        </Popper>
      </Box>
    ));
  };

  const renderMobileMenu = () => (
    <Drawer
      anchor="top"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className={styles.mobileDrawer}
    >
      <List>
        <ListItem className={styles.mobileListItem}>
          <ListItemText primary="Home" className={styles.mobileListItemText} />
        </ListItem>
        {["About", "Services"].map((text) => (
          <ListItem key={text} className={styles.mobileListItem}>
            <ListItemText
              primary={text}
              className={styles.mobileListItemText}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <AppBar className={styles.navbar}>
      <Toolbar className={styles.toolbar}>
        <Box component="a" href="https://pdt.tools/">
          <Image src="/logo_white.svg" alt="logo" width={126} height={50} />
        </Box>

        {/* {!isMobile && (
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {renderDesktopMenu()}
          </Box>
        )}

        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setIsOpen(!isOpen)}
            sx={{ ml: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )} */}

        {/* {renderMobileMenu()} */}
      </Toolbar>
    </AppBar>
  );
}
