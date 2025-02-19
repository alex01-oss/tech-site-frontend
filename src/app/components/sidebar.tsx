import React, { useEffect, useState } from "react";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { fetchMenuData } from "../api/service";

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
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 256,
        flexShrink: 0,
        zIndex: 0,
        "& .MuiDrawer-paper": {
          width: 256,
          backgroundColor: "#F5F6FA",
          color: "#7B8496",
          position: "relative",
          height: "calc(100vh - 60px)",
        },
      }}
    >
      <List>
        {Object.entries(menuData.searchTypes).map(
          ([category, { title, items }]) => (
            <React.Fragment key={category}>
              <ListItem disablePadding>
                <ListItemButton disabled>
                  <ListItemText primary={title} />
                </ListItemButton>
              </ListItem>

              {items.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveItem({ category, index });
                      onMenuClick(`${item.text}...`, category, item.searchType);
                    }}
                    sx={{
                      color: "#515359",
                      "&:hover": {
                        backgroundColor: "#F1F2F7",
                        color: "#515359",
                      },
                      ...(activeItem?.category === category &&
                      activeItem?.index === index
                        ? {
                            backgroundColor: "#ECEFF4",
                            color: "#0B0E14",
                          }
                        : {}),
                    }}
                  >
                    <ListItemIcon>
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
}
