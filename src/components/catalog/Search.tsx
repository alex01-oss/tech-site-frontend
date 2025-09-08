import React, {memo, useCallback, useEffect, useState} from 'react';
import {Box, Button, Divider, Drawer, IconButton, Paper, Typography, useMediaQuery, useTheme,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import {useDataStore} from "@/features/data/store";
import {AutocompleteSearchField} from "@/components/catalog/SearchField";
import {FiltersPanel} from "@/components/catalog/FiltersPanel";
import {useCatalogStore} from "@/features/catalog/store";
import {FilterFields, SearchFields} from "@/types/searchFields";
import ClearIcon from "@mui/icons-material/Clear";
import {useDictionary} from "@/providers/DictionaryProvider";


interface Props {
    onSearch: (searchFields: Partial<SearchFields>) => void;
    currentSearch: SearchFields;
    currentFilters: FilterFields;
    onFilterToggle: (categoryTitle: keyof FilterFields, itemValue: number, checked: boolean) => void;
    onClearAllFilters: () => void;
}

export const Search: React.FC<Props> = memo(({
    onSearch,
    currentSearch,
    currentFilters,
    onFilterToggle,
    onClearAllFilters,
}) => {
    const theme = useTheme();
    const dict = useDictionary();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { fetchFilters } = useDataStore();
    const { categoryId } = useCatalogStore();

    const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
    const [openFiltersDrawer, setOpenFiltersDrawer] = useState(false);
    const [fields, setFields] = useState<SearchFields>(currentSearch);
    
    const SEARCH_FIELDS: { type: keyof SearchFields; label: string; minLength: number }[] = [
        { type: "code", label: dict.catalog.search.code, minLength: 1 },
        { type: "shape", label: dict.catalog.search.shape, minLength: 0 },
        { type: "dimensions", label: dict.catalog.search.dimensions, minLength: 1 },
        { type: "machine", label: dict.catalog.search.machine, minLength: 1 },
    ];

    useEffect(() => {
        setFields(currentSearch);
    }, [currentSearch]);

    useEffect(() => {
        fetchFilters(categoryId).catch(console.error);
    }, [fetchFilters, categoryId]);

    const handleChange = useCallback((key: keyof SearchFields, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSearch = useCallback(() => {
        onSearch(fields);
        setOpenSearchDrawer(false);
        setOpenFiltersDrawer(false);
    }, [fields, onSearch]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    }, [handleSearch]);

    const drawerStyles = {
        PaperProps: {
            sx: {
                borderRadius: {
                    xs: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
                    sm: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
                },
                overflow: 'hidden',
            },
        },
    };

    const buttonStyle = {
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(6),
        fontWeight: 'bold',
    };

    const renderSearchFields = () => SEARCH_FIELDS.map((f, i) => (
        <React.Fragment key={f.type}>
            <AutocompleteSearchField
                {...f}
                value={fields[f.type] || ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                isMobile={isMobile}
            />
            {!isMobile && i < SEARCH_FIELDS.length - 1 && (
                <Divider orientation="vertical" flexItem sx={{ my: theme.spacing(1) }} />
            )}
        </React.Fragment>
    ));

    const mobileDrawer = (open: boolean, setOpen: (v: boolean) => void, content: React.ReactNode) => (
        <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)} {...drawerStyles}>
            <Box
                p={theme.spacing(3)}
                sx={{
                    width: { xs: '100vw', sm: 350 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing(2),
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
        <Box sx={{ display: 'flex', gap: theme.spacing(3) }}>
            <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenSearchDrawer(true)}
                startIcon={<SearchIcon />}
                aria-haspopup="dialog"
                aria-controls="mobile-search-drawer"
                sx={{
                    ...buttonStyle,
                    boxShadow: 'none',
                    color: theme.palette.common.white
                }}
            >
                {dict.common.search}
            </Button>

            <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenFiltersDrawer(true)}
                startIcon={<TuneIcon />}
                aria-haspopup="dialog"
                aria-controls="mobile-filters-drawer"
                sx={{
                    ...buttonStyle,
                    borderColor: theme.palette.grey[300],
                    color: theme.palette.text.primary,
                    '&:hover': {
                        backgroundColor: theme.palette.grey[100],
                        borderColor: theme.palette.grey[400],
                    },
                }}
            >
                {dict.common.filters}
            </Button>

            {mobileDrawer(openSearchDrawer, setOpenSearchDrawer, (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={theme.spacing(1)}>
                        <Typography variant="h6" component="h2">{dict.catalog.search.params}</Typography>
                        <IconButton onClick={() => setOpenSearchDrawer(false)} aria-label={dict.common.close}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {renderSearchFields()}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => {
                            setFields({
                                code: "",
                                shape: "",
                                dimensions: "",
                                machine: "",
                            });
                            handleSearch();
                        }}
                        startIcon={<SearchIcon />}
                        sx={{ ...buttonStyle, height: theme.spacing(6.25) }}>
                        {dict.common.apply}
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => SEARCH_FIELDS.forEach(f => handleChange(f.type, ''))}
                        startIcon={<ClearIcon />}
                        sx={{
                            ...buttonStyle,
                            height: theme.spacing(6.25),
                            borderColor: theme.palette.grey[300],
                            color: theme.palette.text.primary,
                            '&:hover': {
                                backgroundColor: theme.palette.grey[100],
                                borderColor: theme.palette.grey[400],
                            },
                        }}
                    >
                        {dict.catalog.search.clearAll}
                    </Button>
                </>
            ))}

            {mobileDrawer(openFiltersDrawer, setOpenFiltersDrawer, (
                <FiltersPanel
                    filters={currentFilters}
                    onFilterToggle={onFilterToggle}
                    onClearAllFilters={onClearAllFilters}
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
                p: theme.spacing(0.5),
                borderRadius: theme.shape.borderRadius,
                overflow: 'hidden',
            }}
            role="search"
        >
            {renderSearchFields()}
            <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ ...buttonStyle, boxShadow: 'none', px: theme.spacing(3) }}
            >
                {dict.common.search}
            </Button>
        </Paper>
    );

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', mb: theme.spacing(2) }}>
            {content}
        </Box>
    );
});