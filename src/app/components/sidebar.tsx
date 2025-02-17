import React, { useEffect, useState } from "react";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
  styled,
} from "@mui/material";
import styles from "../styles/sidebar.module.css";
import { fetchMenuData } from "../api/service";
import Image from "next/image";

const MenuHeader = styled(ListItemButton)({
  "&.Mui-disabled": {
    color: "#ffcdd2 !important",
    opacity: 1,
  },
});

interface MenuItem {
  text: string;
  searchType: string;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

interface MenuData {
  searchTypes: {
    [key: string]: MenuCategory;
  };
}

interface SidebarProps {
  onMenuClick: (
    newPlaceholder: string,
    category: string,
    searchType: string
  ) => void;
}

export default function Sidebar({ onMenuClick }: SidebarProps) {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [activeItem, setActiveItem] = useState<{
    category: string;
    index: number;
  } | null>(null);

  useEffect(() => {
    fetchMenuData()
      .then((data) => {
        setMenuData(data);
        const firstCategory = Object.keys(data.searchTypes)[0];
        const firstItem = data.searchTypes[firstCategory].items[0];
        setActiveItem({ category: firstCategory, index: 0 });
        onMenuClick(
          `${firstItem.text}...`,
          firstCategory,
          firstItem.searchType
        );
      })
      .catch(console.error);
  }, []);

  if (!menuData) return null;

  return (
    <Drawer variant="permanent" anchor="left" className={styles.drawer}>
      {/* <Box component="a" href="https://pdt.tools/" className={styles.logo}>
        <Image src="/logo_white.svg" alt="logo" width={126} height={50} />
      </Box> */}
      <Divider className={styles.divider} />
      <List>
        {Object.entries(menuData.searchTypes).map(
          ([category, { title, items }]) => (
            <React.Fragment key={category}>
              <ListItem disablePadding>
                <MenuHeader disabled>
                  <ListItemText primary={title} />
                </MenuHeader>
              </ListItem>
              {items.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveItem({ category, index });
                      onMenuClick(`${item.text}...`, category, item.searchType);
                    }}
                    className={`${styles.listItemButton} ${
                      activeItem?.category === category &&
                      activeItem?.index === index
                        ? styles.listItemButtonActive
                        : ""
                    }`}
                  >
                    <ListItemIcon className={styles.listItemIcon}>
                      <LabelImportantIcon className={styles.icon} />
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </React.Fragment>
          )
        )}
      </List>
    </Drawer>
  );
}
