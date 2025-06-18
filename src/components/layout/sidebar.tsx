import React, {memo, useEffect, useState} from "react";
import {
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, useMediaQuery, useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/Search";
import {useMenuStore} from "@/features/menu/store";
import {MenuCategory, MenuItem, MenuSubItem} from "@/features/menu/types";

interface SidebarProps {
    onMenuClick: (placeholder: string, category: string, searchType: string) => void;
}

const Sidebar = memo(({onMenuClick}: SidebarProps) => {
    const {menu, fetchMenu, isOpen, toggleOpen} = useMenuStore();
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const [openItems, setOpenItems] = useState<Record<string, Record<number, boolean>>>({});
    const isMobile = useMediaQuery(useTheme().breakpoints.down("md"));

    useEffect(() => {
        fetchMenu().catch(console.error);
    }, [fetchMenu]);

    const toggleCategory = (title: string) => {
        setOpenCategories((prev) => ({...prev, [title]: !prev[title]}));
        setOpenItems({});
    };

    const toggleItem = (category: string, index: number) => {
        setOpenItems((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [index]: !prev[category]?.[index],
            },
        }));
    };

    if (!menu.length) return null;

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            anchor="left"
            open={isMobile ? isOpen : true}
            onClose={isMobile ? toggleOpen : undefined}
            sx={{
                width: 256,
                flexShrink: 0,
                zIndex: 1200,
                "& .MuiDrawer-paper": {
                    width: 256,
                    borderRight: "1px solid rgba(142, 32, 65, 0.1)",
                    top: isMobile ? 0 : "60px",
                    height: isMobile ? "100vh" : "calc(100vh - 60px)",
                    position: "sticky",
                    overflowY: "auto",
                },
            }}
        >
            <List>
                {menu.map((category: MenuCategory, categoryIndex: any) => (
                    <React.Fragment key={`cat-${categoryIndex}`}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => toggleCategory(category.title)}>
                                <ListItemIcon sx={{minWidth: "30px"}}>
                                    {openCategories[category.title] ? <ExpandMoreIcon/> : <ChevronRightIcon/>}
                                </ListItemIcon>
                                <ListItemText primary={category.title} sx={{
                                    "& .MuiTypography-root": {
                                        fontWeight: "bold",
                                        color: "primary.main"
                                    }
                                }}/>
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={openCategories[category.title]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {category.items.map((item: MenuItem, itemIndex) => (
                                    <React.Fragment key={`item-${itemIndex}`}>
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={() => toggleItem(category.title, itemIndex)}
                                                            sx={{pl: 4}}>
                                                <ListItemIcon sx={{minWidth: "30px"}}>
                                                    {openItems[category.title]?.[itemIndex] ? <ExpandMoreIcon/> :
                                                        <ChevronRightIcon/>}
                                                </ListItemIcon>
                                                <ListItemText primary={item.text}/>
                                            </ListItemButton>
                                        </ListItem>

                                        <Collapse in={openItems[category.title]?.[itemIndex]} timeout="auto"
                                                  unmountOnExit>
                                            <List component="div" disablePadding>
                                                {item.items.map((sub: MenuSubItem, subIndex: any) => (
                                                    <ListItem key={`sub-${subIndex}`} disablePadding>
                                                        {sub.type === "button" && sub.url ? (
                                                            <ListItemButton component="a" href={sub.url} target="_blank"
                                                                            sx={{pl: 6}}>
                                                                <ListItemIcon sx={{minWidth: "30px"}}>
                                                                    <PictureAsPdfIcon fontSize="small"/>
                                                                </ListItemIcon>
                                                                <ListItemText primary={sub.text}/>
                                                            </ListItemButton>
                                                        ) : (
                                                            <ListItemButton
                                                                onClick={() =>
                                                                    onMenuClick(sub.text, category.title, sub.searchType ?? "")
                                                                }
                                                                sx={{pl: 6}}
                                                            >
                                                                <ListItemIcon sx={{minWidth: "30px"}}>
                                                                    <SearchIcon fontSize="small"/>
                                                                </ListItemIcon>
                                                                <ListItemText primary={sub.text}/>
                                                            </ListItemButton>
                                                        )}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse>
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