import React, {memo, useEffect} from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
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
import {useDataStore} from "@/features/data/store";
import CloseIcon from "@mui/icons-material/Close";
import {FilterItem} from "@/features/data/types";
import DoneIcon from '@mui/icons-material/Done';
import {useCatalogStore} from "@/features/catalog/store";
import {FiltersSkeleton} from "@/components/skeletons/FiltersSkeleton";

interface FiltersPanelProps {
    filters: Record<string, Set<number>>;
    onFilterToggle: (categoryTitle: string, itemValue: number, checked: boolean) => void;
    onClearAllFilters: () => void;
    onClose?: () => void;
    isMobileDrawer?: boolean;
    dict: {
        filters: string,
        apply: string,
        error: string,
        mm: string,
        titles: Record<string, string>
    }
}

export const FiltersPanel: React.FC<FiltersPanelProps> = memo(({
    filters,
    onFilterToggle,
    onClose,
    isMobileDrawer = false,
    dict
}) => {
    const {filters: filterData, filtersLoading, filtersError, fetchFilters} = useDataStore();
    const {categoryId} = useCatalogStore();
    const theme = useTheme();

    useEffect(() => {
        void fetchFilters(categoryId);
    }, [fetchFilters, categoryId]);

    const toolbarHeight = theme.mixins.toolbar.minHeight as number;

    return filtersLoading
        ? <FiltersSkeleton isMobileDrawer={isMobileDrawer} />
        : (
            <Box
                sx={{
                    width: {xs: '100%', sm: theme.spacing(32)},
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing(2),
                    alignItems: 'stretch',
                    overflowY: 'auto',
                    ...(isMobileDrawer ? {} : {
                        minWidth: theme.spacing(32),
                        position: 'sticky',
                        height: `calc(100vh - ${toolbarHeight}px)`,
                        top: toolbarHeight,
                        backgroundColor: theme.palette.background.default,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        px: 0,
                        py: 0,
                        overflowX: 'hidden',
                    }),
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={theme.spacing(1)}
                    sx={{px: isMobileDrawer ? 0 : theme.spacing(3)}}
                >
                    {isMobileDrawer && (
                        <Typography variant="h6" component="div">
                            {dict.filters}
                        </Typography>
                    )}
                    {onClose && (
                        <IconButton onClick={onClose} aria-label="close filters">
                            <CloseIcon/>
                        </IconButton>
                    )}
                </Box>

                {filtersLoading && (
                    <Typography sx={{my: theme.spacing(2), textAlign: 'center'}}>
                        <CircularProgress/>
                    </Typography>
                )}
                {filtersError && (
                    <Typography color="error" sx={{my: theme.spacing(2), textAlign: 'center'}}>
                        {dict.error} {filtersError}
                    </Typography>
                )}

                {filterData && Object.keys(filterData).map((categoryTitle: string) => {
                    const categoryItems = filterData[categoryTitle];

                    let translatedTitle = categoryTitle
                    if (categoryTitle in dict.titles) {
                        translatedTitle = dict.titles[categoryTitle]
                    }

                    return (
                        <React.Fragment key={categoryTitle}>
                            <Box sx={isMobileDrawer ? {mb: theme.spacing(2)} : {}}>
                                {isMobileDrawer ? (
                                    <>
                                        <Typography variant="subtitle1"
                                                    sx={{fontWeight: theme.typography.fontWeightBold}}>
                                            {translatedTitle}
                                        </Typography>
                                        <Divider sx={{my: theme.spacing(1), borderColor: theme.palette.grey[200]}}/>
                                    </>
                                ) : (
                                    <List disablePadding>
                                        <ListItem disablePadding sx={{py: theme.spacing(1)}}>
                                            <ListItemText
                                                primary={translatedTitle}
                                                sx={{
                                                    "& .MuiTypography-root": {
                                                        fontWeight: theme.typography.fontWeightBold,
                                                        color: theme.palette.primary.main,
                                                        ml: theme.spacing(2),
                                                    },
                                                }}
                                            />
                                        </ListItem>
                                    </List>
                                )}
                                <FormGroup sx={{pl: isMobileDrawer ? 0 : theme.spacing(2)}}>
                                    {categoryItems.map((item: FilterItem) => {
                                        const nameKey = Object.keys(item).find(key => key !== 'id');
                                        let labelText = nameKey ? item[nameKey] : '';

                                        if (categoryTitle.toLowerCase() === 'mountings' && item.mm && item.inch) {
                                            labelText = `${item.mm} ${dict.mm} / ${item.inch} ″`;
                                        }

                                        const isChecked = filters[categoryTitle]?.has(item.id) || false;

                                        return (
                                            <FormControlLabel
                                                key={item.id}
                                                control={
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onChange={(e) =>
                                                            onFilterToggle(categoryTitle, item.id, e.target.checked)
                                                        }
                                                        size="small"
                                                        sx={isMobileDrawer ? {p: theme.spacing(0.5)} : {}}
                                                    />
                                                }
                                                label={isMobileDrawer
                                                    ? (<Typography variant="body2">{labelText}</Typography>)
                                                    : (labelText)}
                                                sx={{width: '100%', m: 0, py: isMobileDrawer ? 0 : theme.spacing(0.5)}}
                                            />
                                        );
                                    })}
                                </FormGroup>
                            </Box>
                        </React.Fragment>
                    );
                })}

                {isMobileDrawer && (
                    <Box sx={{mt: theme.spacing(2), display: 'flex', gap: theme.spacing(1)}}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={onClose}
                            startIcon={<DoneIcon/>}
                        >
                            {dict.apply}
                        </Button>
                    </Box>
                )}
            </Box>
        )
    }
);