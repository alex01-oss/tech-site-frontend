import React, {memo, useCallback, useEffect, useState} from 'react';
import {Autocomplete, CircularProgress, InputAdornment, TextField, useTheme,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';
import {autoCompleteApi} from "@/features/autocomplete/api";
import {useCatalogStore} from "@/features/catalog/store";
import {SearchFields} from "@/types/searchFields";
import {SxProps} from "@mui/system";

interface Props {
    type: keyof SearchFields;
    label: string;
    minLength: number;
    value: string;
    onChange: (type: keyof SearchFields, value: string) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    isMobile?: boolean;
    dict: { enter: string }
}

const apiMap = {
    code: autoCompleteApi.autocompleteCode,
    shape: autoCompleteApi.autocompleteShape,
    dimensions: autoCompleteApi.autocompleteDimensions,
    machine: autoCompleteApi.autocompleteMachine,
};

export const AutocompleteSearchField: React.FC<Props> = memo(
    ({type, label, minLength, value, onChange, onKeyPress, isMobile, dict}) => {
        const [options, setOptions] = useState<string[]>([]);
        const [loading, setLoading] = useState(false);
        const theme = useTheme();

        const { categoryId, search, filters } = useCatalogStore();

        const getPlaceholderText = (lbl: string): string => `${dict.enter} ${lbl}...`;

        const fetchOptionsDebounced = useCallback(
            debounce(async (
                query: string,
                currentSearch: typeof search,
                currentFilters: typeof filters
            ) => {
                if (query.length === 0 || query.length < minLength || !categoryId) {
                    setOptions([]);
                    return;
                }

                setLoading(true);
                try {
                    const apiCall = apiMap[type];

                    const params = {
                        q: query,
                        category_id: categoryId,
                        ...(currentSearch.code && { search_code: currentSearch.code }),
                        ...(currentSearch.shape && { search_shape: currentSearch.shape }),
                        ...(currentSearch.dimensions && { search_dimensions: currentSearch.dimensions }),
                        ...(currentSearch.machine && { search_machine: currentSearch.machine }),
                        ...(currentFilters.bondIds && { bond_ids: currentFilters.bondIds }),
                        ...(currentFilters.gridIds && { grid_size_ids: currentFilters.gridIds }),
                        ...(currentFilters.mountingIds && { mounting_ids: currentFilters.mountingIds }),
                    }

                    const res = await apiCall(params);
                    setOptions(res);
                } catch (error) {
                    console.error(`Error fetching autocomplete for ${type}:`, error);
                    setOptions([]);
                } finally {
                    setLoading(false);
                }
            }, 300),
            [type, minLength, categoryId, search, filters]
        );

        useEffect(() => {
            return () => fetchOptionsDebounced.cancel();
        }, [fetchOptionsDebounced]);

        const handleInputChange = useCallback(
            (_: React.SyntheticEvent, newInputValue: string, reason: string) => {
                onChange(type, newInputValue);

                if (reason === 'input') void fetchOptionsDebounced(newInputValue, search, filters);
                else if (reason === 'clear') {
                    setOptions([]);
                    fetchOptionsDebounced.cancel();
                }
            },
            [onChange, type, fetchOptionsDebounced, search, filters]
        );

        const handleSelectChange = useCallback(
            (_: React.SyntheticEvent, newValue: string | null) => {
                onChange(type, newValue || '');
                setOptions([]);
                fetchOptionsDebounced.cancel();
            },
            [onChange, type, fetchOptionsDebounced]
        );

        const inputPropsSx: SxProps = isMobile ? {
            borderRadius: theme.shape.borderRadius,
            height: theme.spacing(6.25),
            backgroundColor: theme.palette.background.paper,
            '& fieldset': {
                borderColor: theme.palette.grey[300],
            },
            '&:hover fieldset': {
                borderColor: theme.palette.grey[400],
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
            },
        } : {
            height: '100%',
            borderRadius: 0,
            '& .MuiInputBase-input': {
                paddingTop: theme.spacing(1.5),
                paddingBottom: theme.spacing(1.5),
                paddingLeft: theme.spacing(1.75),
                paddingRight: theme.spacing(0.5),
            },
        };

        const textFieldSx: SxProps = isMobile ? {
            '& .MuiOutlinedInput-root': { borderRadius: theme.shape.borderRadius },
            mb: theme.spacing(0),
        } : {
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
                height: theme.spacing(6),
                borderRadius: 0,
                backgroundColor: 'transparent',
                '& fieldset': { border: 'none' },
            },
            '& .MuiInputBase-input': {
                py: theme.spacing(1.25),
                px: theme.spacing(1.5),
            },
        };

        return (
            <Autocomplete
                freeSolo
                options={options}
                loading={loading}
                value={value}
                onInputChange={handleInputChange}
                onChange={handleSelectChange}
                sx={{flexGrow: 1, minWidth: isMobile ? undefined : 120}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder={getPlaceholderText(label)}
                        onKeyPress={onKeyPress}
                        fullWidth
                        size={isMobile ? undefined : "small"}
                        sx={textFieldSx}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: isMobile && (
                                <InputAdornment position="start">
                                    <SearchIcon color="action"/>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                            sx: inputPropsSx,
                        }}
                    />
                )}
            />
        );
    }
);