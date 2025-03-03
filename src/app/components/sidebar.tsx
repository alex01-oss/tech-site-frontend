import React, { useEffect, useState, memo } from "react";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { fetchData } from "../api/service";

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

const Sidebar = memo(({ onMenuClick }: SidebarProps) => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [activeItem, setActiveItem] = useState<{
    category: string;
    index: number;
  } | null>(null);

  useEffect(() => {
    const cachedMenuData = sessionStorage.getItem("menuData");

    if (cachedMenuData) {
      const parsedData = JSON.parse(cachedMenuData);
      setMenuData(parsedData);

      if (!activeItem) {
        const firstCategory = Object.keys(parsedData.searchTypes)[0];
        const firstItem = parsedData.searchTypes[firstCategory].items[0];
        setActiveItem({ category: firstCategory, index: 0 });
        onMenuClick(
          `${firstItem.text}...`,
          firstCategory,
          firstItem.searchType
        );
      }
    } else {
      fetchData("menu")
        .then((data) => {
          setMenuData(data);
          sessionStorage.setItem("menuData", JSON.stringify(data));

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
    }
  }, []);

  if (!menuData) return null;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 256,
        flexShrink: 0,
        zIndex: 0,
        position: "sticky",
        top: "60px",
        height: "calc(100vh - 60px)",
        "& .MuiDrawer-paper": {
          borderRight: "1px solid rgba(142, 32, 65, 0.1)",
          width: 256,
          color: "text.secondary",
          position: "sticky",
          top: "60px",
          height: "calc(100vh - 60px)",
        },
      }}
    >
      <List>
        {Object.entries(menuData.searchTypes).map(
          ([category, { title, items }]) => (
            <React.Fragment key={category}>
              <ListItem disablePadding>
                <ListItemButton sx={{ cursor: "auto" }}>
                  <ListItemText primary={title} />
                </ListItemButton>
              </ListItem>

              {items.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveItem({ category, index });
                      onMenuClick(item.text, category, item.searchType);
                    }}
                    sx={{
                      color: "text.primary",
                      borderRadius: "8px",
                      margin: "6px 12px",
                      "&:hover": {
                        backgroundColor: "rgba(142, 32, 65, 0.1)",
                        color: "primary.main",
                      },
                      ...(activeItem?.category === category &&
                      activeItem?.index === index
                        ? {
                            backgroundColor: "rgba(142, 32, 65, 0.1)",
                            color: "primary.main",
                          }
                        : {}),
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      <LabelImportantIcon />
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
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
