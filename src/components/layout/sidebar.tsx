import React, {memo, useEffect, useState} from "react";
import {
    Checkbox,
    Drawer,
    FormControlLabel,
    FormGroup,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {useMenuStore} from "@/features/menu/store";
import {MenuItem} from "@/features/menu/types";

interface SidebarProps {
    onFilterChange: (filters: Record<string, string[]>) => void;
}

const Sidebar = memo(({ onFilterChange }: SidebarProps) => {
    const { menu, fetchMenu, isOpen, toggleOpen } = useMenuStore();
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const isMobile = useMediaQuery(useTheme().breakpoints.down("md"));
    const theme = useTheme();
    const drawerWidth = 256;

    useEffect(() => {
        fetchMenu().catch(console.error);
    }, []);

    const handleFilterChange = (categoryTitle: string, itemValue: string) => {
        setSelectedFilters((prevFilters) => {
            const currentCategoryFilters = prevFilters[categoryTitle] || [];
            let newCategoryFilters;

            if (currentCategoryFilters.includes(itemValue)) {
                newCategoryFilters = currentCategoryFilters.filter((value) => value !== itemValue);
            } else {
                newCategoryFilters = [...currentCategoryFilters, itemValue];
            }

            const newFilters = {
                ...prevFilters,
                [categoryTitle]: newCategoryFilters,
            };

            onFilterChange(newFilters);
            return newFilters;
        });
    };

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            anchor="left"
            open={isMobile ? isOpen : true}
            onClose={isMobile ? toggleOpen : undefined}
            ModalProps={{ keepMounted: true }}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    position: isMobile ? "fixed" : "sticky",
                    backgroundColor: theme.palette.background.default,
                    zIndex: isMobile ? theme.zIndex.drawer : "auto",
                    top: "64px",
                    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
                    overflow: "hidden",
                },
            }}
        >
            {isMobile && <Toolbar />}

            <List disablePadding>
                {menu.map((category, categoryIndex) => (
                    <React.Fragment key={`cat-${categoryIndex}`}>
                        <ListItem disablePadding sx={{ py: 1 }}>
                            <ListItemText
                                primary={category.title}
                                sx={{
                                    "& .MuiTypography-root": {
                                        fontWeight: "bold",
                                        color: "primary.main",
                                        ml: 2,
                                    },
                                }}
                            />
                        </ListItem>

                        <FormGroup sx={{ pl: 2 }}>
                            {category.items.map((item: MenuItem, itemIndex: number) => (
                                <FormControlLabel
                                    key={`item-${itemIndex}`}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={selectedFilters[category.title]?.includes(item.searchValue) || false}
                                            onChange={() => handleFilterChange(category.title, item.searchValue)}
                                        />
                                    }
                                    label={item.text}
                                    sx={{ py: 0.5 }}
                                />
                            ))}
                        </FormGroup>
                    </React.Fragment>
                ))}
            </List>
        </Drawer>
    );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;