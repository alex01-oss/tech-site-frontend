import React, {memo, useCallback, useEffect, useState} from 'react';
import {Autocomplete, CircularProgress, InputAdornment, TextField, useTheme,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';
import {useCatalogStore} from "@/features/catalog/store";
import {SearchFields} from "@/types/searchFields";
import {SxProps} from "@mui/system";
import {useDictionary} from "@/providers/DictionaryProvider";
import { API_MAP } from '@/utils/search';

interface Props {
    type: keyof SearchFields;
    label: string;
    minLength: number;
    value: string;
    onChange: (type: keyof SearchFields, value: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    isMobile?: boolean;
}

export const AutocompleteSearchField: React.FC<Props> = memo(
    ({type, label, minLength, value, onChange, onKeyDown, isMobile}) => {
        const [options, setOptions] = useState<string[]>([]);
        const [loading, setLoading] = useState(false);
        const theme = useTheme();
        const dict = useDictionary()

        const { categoryId, search, filters } = useCatalogStore();

        const fetchOptions = useCallback(
            debounce(async (query: string) => {
                if (query.length === 0 || query.length < minLength || !categoryId) {
                    setOptions([]);
                    return;
                }

                setLoading(true);
                try {
                    const apiCall = API_MAP[type];

                    const params = {
                        q: query,
                        category_id: categoryId,
                        ...Object.fromEntries(
                            Object.entries({
                                search_code: search.code,
                                search_shape: search.shape,
                                search_dimensions: search.dimensions,
                                search_machine: search.machine,
                                bond_ids: filters.bond_ids,
                                grid_size_ids: filters.grid_size_ids,
                                mounting_ids: filters.mounting_ids,
                            }).filter(([_, v]) => v && (Array.isArray(v) ? v.length : true))
                        )
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
            return () => fetchOptions.cancel();
        }, [fetchOptions]);

        const handleInputChange = useCallback(
            (_: React.SyntheticEvent, newValue: string, reason: string) => {
                onChange(type, newValue);

                if (reason === 'input') void fetchOptions(newValue);
                else if (reason === 'clear') {
                    setOptions([]);
                    fetchOptions.cancel();
                }
            }, [onChange, type, fetchOptions]
        );

        const handleSelectChange = useCallback(
            (_: React.SyntheticEvent, newValue: string | null) => {
                onChange(type, newValue || '');
                setOptions([]);
                fetchOptions.cancel();
            }, [onChange, type, fetchOptions]
        );

        const inputPropsSx: SxProps = isMobile ? {
            borderRadius: theme.shape.borderRadius,
            height: theme.spacing(6.25),
            backgroundColor: theme.palette.background.paper,
            '& fieldset': { borderColor: theme.palette.grey[300] },
            '&:hover fieldset': { borderColor: theme.palette.grey[400] },
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
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

        const getPlaceholderText = (lbl: string): string => `${dict.catalog.search.enter} ${lbl}...`;

        return (
            <Autocomplete
                freeSolo
                options={options}
                loading={loading}
                value={value}
                onInputChange={handleInputChange}
                onChange={handleSelectChange}
                sx={{flexGrow: 1, minWidth: isMobile ? undefined : 120}}
                aria-label={getPlaceholderText(label)}
                loadingText={dict.common.loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label={getPlaceholderText(label)}
                        onKeyDown={onKeyDown}
                        fullWidth
                        size={isMobile ? undefined : "small"}
                        sx={textFieldSx}
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                startAdornment: isMobile && (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action"/>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20} aria-label={dict.common.loading}/> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                                sx: inputPropsSx,
                            }
                        }}
                    />
                )}
            />
        );
    }
);