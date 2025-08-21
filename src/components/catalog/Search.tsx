import React, {memo, useCallback, useEffect, useState} from 'react';
import {Box, Button, Divider, Drawer, IconButton, Paper, Typography, useMediaQuery, useTheme,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import {useDataStore} from "@/features/data/store";
import {AutocompleteSearchField} from "@/components/catalog/SearchField";
import {FiltersPanel} from "@/components/catalog/FiltersPanel";
import {useCatalogStore} from "@/features/catalog/store";
import {SearchFields} from "@/types/searchFields";
import {SearchDict} from "@/types/dict";


interface Props {
    onSearch: (searchFields: Partial<SearchFields>) => void;
    currentSearchFields: SearchFields;
    currentFilters: Record<string, Set<number>>;
    onFilterToggle: (categoryTitle: string, itemValue: number, checked: boolean) => void;
    onClearAllFilters: () => void;
    dict: SearchDict
}

export const Search: React.FC<Props> = memo(({
    onSearch,
    currentSearchFields,
    currentFilters,
    onFilterToggle,
    onClearAllFilters,
    dict
}) => {
    const FIXED_SEARCH_FIELDS_CONFIG: { type: keyof SearchFields; label: string; minLength: number }[] = [
        { type: "code", label: dict.search.code, minLength: 1 },
        { type: "shape", label: dict.search.shape, minLength: 1 },
        { type: "dimensions", label: dict.search.dimensions, minLength: 1 },
        { type: "machine", label: dict.search.machine, minLength: 1 },
    ];

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const { fetchFilters } = useDataStore();
    const { categoryId } = useCatalogStore();

    const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
    const [openFiltersDrawer, setOpenFiltersDrawer] = useState(false);

    const [fields, setFields] = useState<SearchFields>({
        code: currentSearchFields.code || null,
        shape: currentSearchFields.shape || null,
        dimensions: currentSearchFields.dimensions || null,
        machine: currentSearchFields.machine || null,
    });

    useEffect(() => {
        setFields({
            code: currentSearchFields.code || null,
            shape: currentSearchFields.shape || null,
            dimensions: currentSearchFields.dimensions || null,
            machine: currentSearchFields.machine || null,
        });
    }, [currentSearchFields]);

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

    const renderSearchFields = () => FIXED_SEARCH_FIELDS_CONFIG.map((f, i) => (
        <React.Fragment key={f.type}>
            <AutocompleteSearchField
                {...f}
                value={fields[f.type] || ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                isMobile={isMobile}
                dict={dict.search.field}
            />
            {!isMobile && i < FIXED_SEARCH_FIELDS_CONFIG.length - 1 && (
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
                sx={{
                    ...buttonStyle,
                    boxShadow: 'none',
                    color: theme.palette.common.white
                }}
            >
                {dict.search.search}
            </Button>

            <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenFiltersDrawer(true)}
                startIcon={<TuneIcon />}
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
                {dict.search.filters}
            </Button>

            {mobileDrawer(openSearchDrawer, setOpenSearchDrawer, (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={theme.spacing(1)}>
                        <Typography variant="h6">{dict.search.params}</Typography>
                        <IconButton onClick={() => setOpenSearchDrawer(false)}>
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
                        {dict.search.apply}
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => FIXED_SEARCH_FIELDS_CONFIG.forEach(f => handleChange(f.type, ''))}
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
                        {dict.search.clearAll}
                    </Button>
                </>
            ))}

            {mobileDrawer(openFiltersDrawer, setOpenFiltersDrawer, (
                <FiltersPanel
                    filters={currentFilters}
                    onFilterToggle={onFilterToggle}
                    onClearAllFilters={onClearAllFilters}
                    isMobileDrawer
                    dict={dict.filters}
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
        >
            {renderSearchFields()}
            <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ ...buttonStyle, boxShadow: 'none', px: theme.spacing(3) }}
            >
                {dict.search.search}
            </Button>
        </Paper>
    );

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', mb: theme.spacing(2) }}>
            {content}
        </Box>
    );
});