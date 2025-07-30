import React, {memo, useCallback, useEffect, useState} from 'react';
import {Box, Button, Divider, Drawer, IconButton, Paper, Typography, useMediaQuery, useTheme,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import {useMenuStore} from "@/features/menu/store";
import AutocompleteSearchField from "@/components/common/SearchField";
import FiltersPanel from "@/components/layout/FiltersPanel";


interface Props {
    onSearch: (
        searchFields: { code?: string; shape?: string; dimensions?: string; machine?: string },
        filters: Record<string, Set<string>>
    ) => void;
    currentSearchFields: { code?: string; shape?: string; dimensions?: string; machine?: string };
    currentFilters: Record<string, string[]>;
}

type SearchFieldKey = "code" | "shape" | "dimensions" | "machine";

const FIXED_SEARCH_FIELDS_CONFIG: { type: SearchFieldKey; label: string; minLength: number }[] = [
    {type: "code", label: "Code", minLength: 1},
    {type: "shape", label: "Shape", minLength: 1},
    {type: "dimensions", label: "Dimensions", minLength: 1},
    {type: "machine", label: "Machine", minLength: 1},
];

const Search: React.FC<Props> = memo(({onSearch, currentSearchFields, currentFilters}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const {fetchMenu} = useMenuStore();

    const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
    const [openFiltersDrawer, setOpenFiltersDrawer] = useState(false);

    const [fields, setFields] = useState({
        code: "",
        shape: "",
        dimensions: "",
        machine: "",
    });

    const [filters, setFilters] = useState<Record<string, Set<string>>>({});

    useEffect(() => {
        fetchMenu().catch(console.error);
    }, [fetchMenu]);

    useEffect(() => {
        setFields({
            code: currentSearchFields.code || "",
            shape: currentSearchFields.shape || "",
            dimensions: currentSearchFields.dimensions || "",
            machine: currentSearchFields.machine || "",
        });

        const newFiltersState: Record<string, Set<string>> = {};
        for (const category in currentFilters) {
            if (currentFilters.hasOwnProperty(category)) {
                newFiltersState[category] = new Set(currentFilters[category]);
            }
        }
        setFilters(newFiltersState);
    }, [currentSearchFields, currentFilters]);


    const handleChange = useCallback((key: keyof typeof fields, value: string) => {
        setFields((prev) => ({...prev, [key]: value}));
    }, []);

    const handleFilterToggle = useCallback((categoryTitle: string, itemValue: string, checked: boolean) => {
        setFilters((prevFilters) => {
            const currentCategoryFilters = prevFilters[categoryTitle] || new Set();
            const newCategoryFilters = new Set(currentCategoryFilters);

            if (checked) newCategoryFilters.add(itemValue)
            else newCategoryFilters.delete(itemValue)

            if (newCategoryFilters.size === 0) {
                const {[categoryTitle]: _, ...rest} = prevFilters;
                return rest;
            }

            return {
                ...prevFilters,
                [categoryTitle]: newCategoryFilters,
            };
        });
    }, []);

    const handleClearAllFilters = useCallback(() => {
        setFilters({});
    }, []);

    const handleSearch = useCallback(() => {
        onSearch(fields, filters);
        setOpenSearchDrawer(false);
        setOpenFiltersDrawer(false);
    }, [fields, filters, onSearch]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch()
    }, [handleSearch]);

    return (
        <Box sx={{width: '100%', maxWidth: '100%', mx: 'auto', mb: 2}}>
            {isMobile ? (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        width: '100%',
                        flexDirection: 'row',
                        p: 0,
                    }}
                >
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => setOpenSearchDrawer(true)}
                        startIcon={<SearchIcon/>}
                        sx={{
                            borderRadius: 1,
                            height: '48px',
                            minHeight: '48px',
                            boxShadow: 'none',
                            fontWeight: 'bold',
                            color: 'white',
                        }}
                    >
                        Search
                    </Button>

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setOpenFiltersDrawer(true)}
                        startIcon={<TuneIcon/>}
                        sx={{
                            borderRadius: 1,
                            height: '48px',
                            minHeight: '48px',
                            fontWeight: 'bold',
                            borderColor: 'grey.300',
                            color: 'text.primary',
                            '&:hover': {
                                backgroundColor: 'grey.100',
                                borderColor: 'grey.400',
                            }
                        }}
                    >
                        Filters
                    </Button>

                    <Drawer
                        anchor="bottom"
                        open={openSearchDrawer}
                        onClose={() => setOpenSearchDrawer(false)}
                        PaperProps={{
                            sx: {
                                borderRadius: {xs: '0 0 16px 16px', sm: '0 0 8px 8px'},
                                overflow: 'hidden',
                            }
                        }}
                    >
                        <Box
                            p={3}
                            sx={{
                                width: {xs: '100vw', sm: 350},
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                alignItems: 'stretch',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6" component="div">
                                    Search Parameters
                                </Typography>
                                <IconButton onClick={() => setOpenSearchDrawer(false)} aria-label="close search">
                                    <CloseIcon/>
                                </IconButton>
                            </Box>

                            {FIXED_SEARCH_FIELDS_CONFIG.map((fieldConfig) => (
                                <AutocompleteSearchField
                                    key={fieldConfig.type}
                                    type={fieldConfig.type}
                                    label={fieldConfig.label}
                                    minLength={fieldConfig.minLength}
                                    value={fields[fieldConfig.type]}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    isMobile={isMobile}
                                />
                            ))}

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSearch}
                                startIcon={<SearchIcon/>}
                                sx={{
                                    mt: 2,
                                    borderRadius: 1,
                                    height: 50,
                                    boxShadow: 'none',
                                    fontWeight: 'bold',
                                }}
                            >
                                Apply Search
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => {
                                    FIXED_SEARCH_FIELDS_CONFIG.forEach(config => handleChange(config.type, ""));
                                }}
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
                                Clear All Fields
                            </Button>
                        </Box>
                    </Drawer>

                    <Drawer
                        anchor="bottom"
                        open={openFiltersDrawer}
                        onClose={() => setOpenFiltersDrawer(false)}
                        PaperProps={{
                            sx: {
                                borderRadius: {xs: '0 0 16px 16px', sm: '0 0 8px 8px'},
                                overflow: 'hidden',
                            }
                        }}
                    >
                        <FiltersPanel
                            filters={filters}
                            onFilterToggle={handleFilterToggle}
                            onClearAllFilters={handleClearAllFilters}
                            onApplyFilters={handleSearch}
                            onClose={() => setOpenFiltersDrawer(false)}
                            isMobileDrawer={true}
                        />
                    </Drawer>
                </Box>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        p: 0.5,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'grey.300',
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: '100%',
                    }}
                >
                    {FIXED_SEARCH_FIELDS_CONFIG.map((fieldConfig, index) => (
                        <React.Fragment key={fieldConfig.type}>
                            <AutocompleteSearchField
                                type={fieldConfig.type}
                                label={fieldConfig.label}
                                minLength={fieldConfig.minLength}
                                value={fields[fieldConfig.type]}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                isMobile={isMobile}
                            />
                            {index < FIXED_SEARCH_FIELDS_CONFIG.length - 1 && (
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        my: 1,
                                        borderColor: 'grey.300',
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}

                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        startIcon={<SearchIcon/>}
                        sx={{
                            borderRadius: 1,
                            height: '48px',
                            minHeight: '48px',
                            boxShadow: 'none',
                            fontWeight: 'bold',
                            flexShrink: 0,
                            px: 3,
                            alignSelf: 'stretch',
                        }}
                    >
                        Search
                    </Button>
                </Paper>
            )}
        </Box>
    );
});

export default Search;