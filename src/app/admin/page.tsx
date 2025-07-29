"use client";

import React from "react";
import {
    Box,
    Container,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {useRouter} from "next/navigation";
import {useAdminDrawerStore} from "@/app/admin/store/useAdminDrawerStore";

const drawerWidth = 256;

const AdminLayout: React.FC = () => {
    const router = useRouter();
    const {isOpen, closeDrawer} = useAdminDrawerStore();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const drawerContent = (
        <Box sx={{width: drawerWidth}}>
            <List>
                <ListItem disablePadding onClick={() => router.push("/blog")}>
                    <ListItemButton>
                        <ListItemIcon><ArticleIcon/></ListItemIcon>
                        <ListItemText primary="Blog"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding onClick={() => router.push("/admin/categories")}>
                    <ListItemButton>
                        <ListItemIcon><CategoryIcon/></ListItemIcon>
                        <ListItemText primary="Categories"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton disabled>
                        <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
                        <ListItemText primary="Products"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            <CssBaseline/>
            <Toolbar/>

            <Container maxWidth="lg" sx={{flex: 1, display: "flex", gap: 2}}>
                {isMobile ? (
                    <Drawer
                        anchor="left"
                        open={isOpen}
                        onClose={closeDrawer}
                        ModalProps={{keepMounted: true}}
                        sx={{
                            display: {xs: "block", sm: "none"},
                            "& .MuiDrawer-paper": {
                                width: drawerWidth,
                                boxSizing: "border-box",
                            },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                ) : (
                    <Box
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            borderRight: "1px solid #ddd",
                            minHeight: "100%",
                            pt: 2,
                            display: {xs: "none", sm: "block"},
                        }}
                    >
                        {drawerContent}
                    </Box>
                )}

                <Box sx={{ flexGrow: 1, py: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to the Admin Panel!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This centralized hub gives you full control over your content and functionality.
                        Use the navigation menu on the left to manage blog posts, categories, and upcoming shop features.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Your productivity is our priority. All tools are designed for intuitive data management and fast deployment of changes.
                    </Typography>
                    <Typography variant="body1">
                        Plan, create, publish — all right here, under your control.
                    </Typography>
                </Box>

            </Container>
        </Box>
    );
};

export default AdminLayout;