import React, {memo, useCallback, useEffect, useState} from 'react';
import {Box, Button, Divider, Drawer, IconButton, Paper, Typography, useMediaQuery, useTheme,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import {useDataStore} from "@/features/data/store";
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

    const { fetchFilters } = useDataStore();

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
        fetchFilters().catch(console.error);
    }, [fetchFilters]);

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

    const drawerStyles = {
        PaperProps: {
            sx: {
                borderRadius: { xs: '0 0 16px 16px', sm: '0 0 8px 8px' },
                overflow: 'hidden',
            },
        },
    };

    const buttonStyle = {
        borderRadius: 1,
        height: 48,
        fontWeight: 'bold',
    };

    const renderSearchFields = () => FIXED_SEARCH_FIELDS_CONFIG.map((f, i) => (
        <React.Fragment key={f.type}>
            <AutocompleteSearchField
                {...f}
                value={fields[f.type]}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                isMobile={isMobile}
            />
            {!isMobile && i < FIXED_SEARCH_FIELDS_CONFIG.length - 1 && (
                <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
            )}
        </React.Fragment>
    ));

    const mobileDrawer = (open: boolean, setOpen: (v: boolean) => void, content: React.ReactNode) => (
        <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)} {...drawerStyles}>
            <Box
                p={3}
                sx={{
                    width: { xs: '100vw', sm: 350 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'stretch',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}
            >
                {content}
            </Box>
        </Drawer>
    );

    const content = isMobile ? (
        <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenSearchDrawer(true)}
                startIcon={<SearchIcon />}
                sx={{ ...buttonStyle, boxShadow: 'none', color: 'white' }}
            >
                Search
            </Button>

            <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenFiltersDrawer(true)}
                startIcon={<TuneIcon />}
                sx={{
                    ...buttonStyle,
                    borderColor: 'grey.300',
                    color: 'text.primary',
                    '&:hover': {
                        backgroundColor: 'grey.100',
                        borderColor: 'grey.400',
                    },
                }}
            >
                Filters
            </Button>

            {mobileDrawer(openSearchDrawer, setOpenSearchDrawer, (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6">Search Parameters</Typography>
                        <IconButton onClick={() => setOpenSearchDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {renderSearchFields()}
                    <Button variant="contained" fullWidth onClick={handleSearch} startIcon={<SearchIcon />} sx={{ ...buttonStyle, height: 50 }}>
                        Apply Search
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => FIXED_SEARCH_FIELDS_CONFIG.forEach(f => handleChange(f.type, ''))}
                        sx={{
                            ...buttonStyle,
                            height: 50,
                            borderColor: 'grey.300',
                            color: 'text.primary',
                            '&:hover': {
                                backgroundColor: 'grey.100',
                                borderColor: 'grey.400',
                            },
                        }}
                    >
                        Clear All Fields
                    </Button>
                </>
            ))}

            {mobileDrawer(openFiltersDrawer, setOpenFiltersDrawer, (
                <FiltersPanel
                    filters={filters}
                    onFilterToggle={handleFilterToggle}
                    onClearAllFilters={handleClearAllFilters}
                    onApplyFilters={handleSearch}
                    onClose={() => setOpenFiltersDrawer(false)}
                    isMobileDrawer
                />
            ))}
        </Box>
    ) : (
        <Paper
            elevation={0}
            sx={{
                display: 'flex',
                alignItems: 'stretch',
                p: 0.5,
                borderRadius: 1,
                overflow: 'hidden',
            }}
        >
            {renderSearchFields()}
            <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ ...buttonStyle, boxShadow: 'none', px: 3 }}
            >
                Search
            </Button>
        </Paper>
    );

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', mb: 2 }}>
            {content}
        </Box>
    );
});

export default Search;