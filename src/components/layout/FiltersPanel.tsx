import React, {memo, useCallback, useEffect} from "react"; // Added useCallback
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {useMenuStore} from "@/features/menu/store";
import {MenuCategory, MenuItem} from "@/features/menu/types";
import CloseIcon from "@mui/icons-material/Close";

interface FiltersPanelProps {
    filters: Record<string, Set<string>>;
    onFilterToggle: (categoryTitle: string, itemValue: string, checked: boolean) => void;
    onClearAllFilters: () => void;
    onApplyFilters: () => void;
    onClose?: () => void;
    isMobileDrawer?: boolean;
}

const FiltersPanel: React.FC<FiltersPanelProps> = memo(({
    filters,
    onFilterToggle,
    onClearAllFilters,
    onApplyFilters,
    onClose,
    isMobileDrawer = false,
}) => {
    const {menu, fetchMenu} = useMenuStore();
    const theme = useTheme();

    useEffect(() => {
        fetchMenu().catch(console.error);
    }, [fetchMenu]);

    const handleApplyAndClose = useCallback(() => {
        onApplyFilters();
        if (onClose) onClose()
    }, [onApplyFilters, onClose]);

    const handleClearAllAndApplyAndClose = useCallback(() => {
        onClearAllFilters();
        onApplyFilters();
        if (onClose) onClose()
    }, [onClearAllFilters, onApplyFilters, onClose]);

    return (
        <Box
            p={3}
            sx={{
                width: {xs: '100vw', sm: 256},
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'stretch',
                maxHeight: '80vh',
                overflowY: 'auto',
                ...(isMobileDrawer ? {} : {
                    minWidth: 256,
                    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
                    position: 'sticky',
                    top: theme.mixins.toolbar.minHeight as number,
                    backgroundColor: theme.palette.background.default,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    px: 0,
                    py: 0,
                    overflowX: 'hidden',
                }),
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}
                 sx={{px: isMobileDrawer ? 0 : 3}}>
                {isMobileDrawer && (
                    <Typography variant="h6" component="div">
                        Filters
                    </Typography>
                )}
                {onClose && (
                    <IconButton onClick={onClose} aria-label="close filters">
                        <CloseIcon/>
                    </IconButton>
                )}
            </Box>

            {useMenuStore.getState().loading && (
                <Typography sx={{my: 2, textAlign: 'center'}}>Loading filters...</Typography>
            )}
            {useMenuStore.getState().error && (
                <Typography color="error" sx={{my: 2, textAlign: 'center'}}>
                    Error: {useMenuStore.getState().error}
                </Typography>
            )}

            {!useMenuStore.getState().loading && !useMenuStore.getState().error && menu.map((category: MenuCategory) => {
                const isChecked = (item: MenuItem) => filters[category.title]?.has(item.searchValue) || false;

                return (
                    <React.Fragment key={category.title}>
                        <Box sx={isMobileDrawer ? {mb: 2} : {}}>
                            {isMobileDrawer ? (
                                <>
                                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                                        {category.title}
                                    </Typography>
                                    <Divider sx={{my: 1, borderColor: 'grey.200'}}/>
                                </>
                            ) : (
                                <List disablePadding>
                                    <ListItem disablePadding sx={{py: 1}}>
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
                                </List>
                            )}
                            <FormGroup sx={{pl: isMobileDrawer ? 0 : 2}}>
                                {category.items.map((item: MenuItem) => (
                                    <FormControlLabel
                                        key={item.text}
                                        control={
                                            <Checkbox
                                                checked={isChecked(item)}
                                                onChange={(e) =>
                                                    onFilterToggle(category.title, item.searchValue, e.target.checked)
                                                }
                                                size="small"
                                                sx={isMobileDrawer ? {p: 0.5} : {}}
                                            />
                                        }
                                        label={isMobileDrawer ? (
                                            <Typography variant="body2">{item.text}</Typography>
                                        ) : (
                                            item.text
                                        )}
                                        sx={{width: '100%', m: 0, py: isMobileDrawer ? 0 : 0.5}}
                                    />
                                ))}
                            </FormGroup>
                        </Box>
                    </React.Fragment>
                );
            })}

            {isMobileDrawer && (
                <>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            borderRadius: 1,
                            height: 50,
                            boxShadow: 'none',
                            fontWeight: 'bold',
                        }}
                        onClick={handleApplyAndClose}
                        startIcon={<SearchIcon/>}
                    >
                        Apply Filters
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleClearAllAndApplyAndClose}
                        sx={{
                            borderRadius: 1,
                            height: 50,
                            fontWeight: 'bold',
                            borderColor: 'grey.300',
                            color: 'text.primary',
                            '&:hover': {
                                backgroundColor: 'grey.100',
                                borderColor: 'grey.400',
                            }
                        }}
                    >
                        Clear All Filters
                    </Button>
                </>
            )}
        </Box>
    );
});

export default FiltersPanel;