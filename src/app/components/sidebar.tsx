import React, { useEffect, useState, memo } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
} from "@mui/material";
import { fetchData } from "../api/service";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Search } from "@mui/icons-material";

interface MenuItem {
  text: string;
  searchType?: string;
  type?: "button";
  url?: string;
  items?: MenuItem[];
}

interface CategoryItems {
  title: string;
  items: MenuItem[];
}

interface MenuData {
  [key: string]: CategoryItems;
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
    level1Index: number;
    level2Index: number;
  } | null>(null);

  const [openLevel1, setOpenLevel1] = useState<{ [key: string]: boolean }>({});

  const [openLevel2, setOpenLevel2] = useState<{
    [key: string]: { [key: number]: boolean };
  }>({});

  useEffect(() => {
    const cachedMenuData = sessionStorage.getItem("menuData");

    if (cachedMenuData) {
      const parsedData = JSON.parse(cachedMenuData);
      setMenuData(parsedData);
    } else {
      fetchData("menu")
        .then((data) => {
          setMenuData(data);
          sessionStorage.setItem("menuData", JSON.stringify(data));
        })
        .catch(console.error);
    }
  }, []);

  const toggleLevel1 = (category: string) => {
    setOpenLevel1({ [category]: !openLevel1[category] });
    setOpenLevel2({});
  };

  const toggleLevel2 = (category: string, index: number) => {
    setOpenLevel2((prev) => {
      const categoryState = prev[category] || {};
      return {
        ...prev,
        [category]: {
          ...categoryState,
          [index]: !categoryState[index],
        },
      };
    });
  };

  const handleMenuItemClick = (
    category: string,
    level1Index: number,
    level2Index: number,
    itemText: string,
    searchType: string = ""
  ) => {
    setActiveItem({
      category,
      level1Index,
      level2Index,
    });
    onMenuClick(itemText, category, searchType);
  };

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
          position: "sticky",
          top: "60px",
          height: "calc(100vh - 60px)",
          overflowY: "auto",
        },
      }}
    >
      <List>
        {Object.entries(menuData).map(([category, { title, items }]) => (
          <React.Fragment key={category}>
            {/* Заголовок категорії першого рівня */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleLevel1(category)}>
                <ListItemIcon
                  sx={{
                    minWidth: "30px",
                  }}
                >
                  {openLevel1[category] ? (
                    <ExpandMoreIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={title}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: "bold",
                      color: "primary.main",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            {/* 1 level */}
            <Collapse in={openLevel1[category]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {items.map((level1Item, level1Index) => (
                  <React.Fragment key={`${category}-${level1Index}`}>
                    {/* 2 level */}
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => toggleLevel2(category, level1Index)}
                        sx={{
                          pl: 4,
                          color: "text.primary",
                        }}
                      >
                        <ListItemIcon
                          sx={{ minWidth: "30px", color: "primary" }}
                        >
                          {openLevel2[category]?.[level1Index] ? (
                            <ExpandMoreIcon />
                          ) : (
                            <ChevronRightIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText primary={level1Item.text} />
                      </ListItemButton>
                    </ListItem>

                    {/* 3 level */}
                    {level1Item.items && level1Item.items.length > 0 && (
                      <Collapse
                        in={openLevel2[category]?.[level1Index]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {level1Item.items.map((level2Item, level2Index) =>
                            level2Item.type === "button" ? (
                              // PDF rendering
                              <ListItem
                                key={`${category}-${level1Index}-${level2Index}`}
                                disablePadding
                              >
                                <ListItemButton
                                  component="a"
                                  href={level2Item.url}
                                  target="_blank"
                                  sx={{ pl: 6 }}
                                >
                                  <ListItemIcon sx={{ minWidth: "30px" }}>
                                    <PictureAsPdfIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary={level2Item.text} />
                                </ListItemButton>
                              </ListItem>
                            ) : (
                              // search rendering
                              <ListItem
                                key={`${category}-${level1Index}-${level2Index}`}
                                disablePadding
                              >
                                <ListItemButton
                                  onClick={() =>
                                    handleMenuItemClick(
                                      category,
                                      level1Index,
                                      level2Index,
                                      level2Item.text,
                                      level2Item.searchType
                                    )
                                  }
                                  sx={{ pl: 6 }}
                                >
                                  <ListItemIcon sx={{ minWidth: "30px" }}>
                                    <Search fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary={level2Item.text} />
                                </ListItemButton>
                              </ListItem>
                            )
                          )}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
