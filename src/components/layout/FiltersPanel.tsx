import React, {memo, useCallback, useEffect} from "react"; // Added useCallback
import {
    Box,
    Button,
    Checkbox, CircularProgress,
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
import {useDataStore} from "@/features/data/store";
import CloseIcon from "@mui/icons-material/Close";
import {FilterItem} from "@/features/data/types";

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
    const {filters: filterData, filtersLoading, filtersError, fetchFilters} = useDataStore();
    const theme = useTheme();

    useEffect(() => {
        fetchFilters().catch(console.error);
    }, [fetchFilters]);

    const handleApplyAndClose = useCallback(() => {
        onApplyFilters();
        if (onClose) onClose();
    }, [onApplyFilters, onClose]);

    const handleClearAllAndApplyAndClose = useCallback(() => {
        onClearAllFilters();
        onApplyFilters();
        if (onClose) onClose();
    }, [onClearAllFilters, onApplyFilters, onClose]);

    return (
        <Box
            sx={{
                width: {xs: '100%', sm: 256},
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'stretch',
                overflowY: 'auto',
                ...(isMobileDrawer ? {} : {
                    minWidth: 256,
                    maxHeight: 'calc(100vh - 64px)',
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

            {filtersLoading && (
                <Typography sx={{my: 2, textAlign: 'center'}}>
                    <CircularProgress/>
                </Typography>
            )}
            {filtersError && (
                <Typography color="error" sx={{my: 2, textAlign: 'center'}}>
                    Error: {filtersError}
                </Typography>
            )}

            {filterData && Object.keys(filterData).map((categoryTitle: string) => {
                const categoryItems = filterData[categoryTitle];

                const isChecked = (item: FilterItem) => filters[categoryTitle]?.has(item.name) || false;

                return (
                    <React.Fragment key={categoryTitle}>
                        <Box sx={isMobileDrawer ? {mb: 2} : {}}>
                            {isMobileDrawer ? (
                                <>
                                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                                        {categoryTitle}
                                    </Typography>
                                    <Divider sx={{my: 1, borderColor: 'grey.200'}}/>
                                </>
                            ) : (
                                <List disablePadding>
                                    <ListItem disablePadding sx={{py: 1}}>
                                        <ListItemText
                                            primary={categoryTitle}
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
                                {categoryItems.map((item: FilterItem) => (
                                    <FormControlLabel
                                        key={item.name}
                                        control={
                                            <Checkbox
                                                checked={isChecked(item)}
                                                onChange={(e) =>
                                                    onFilterToggle(categoryTitle, item.name, e.target.checked)
                                                }
                                                size="small"
                                                sx={isMobileDrawer ? {p: 0.5} : {}}
                                            />
                                        }
                                        label={isMobileDrawer ? (
                                            <Typography variant="body2">{item.name}</Typography>
                                        ) : (
                                            item.name
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