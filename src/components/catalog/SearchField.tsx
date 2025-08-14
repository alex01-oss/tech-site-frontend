import React, {memo, useCallback, useEffect, useState} from 'react';
import {Autocomplete, CircularProgress, InputAdornment, TextField,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';
import {autoCompleteApi} from "@/features/autocomplete/api";
import {useCatalogStore} from "@/features/catalog/store";
import {SearchFields} from "@/types/searchFields";

interface AutocompleteSearchFieldProps {
    type: keyof SearchFields;
    label: string;
    minLength: number;
    value: string;
    onChange: (type: keyof SearchFields, value: string) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    isMobile?: boolean;
}

const apiMap = {
    code: autoCompleteApi.autocompleteCode,
    shape: autoCompleteApi.autocompleteShape,
    dimensions: autoCompleteApi.autocompleteDimensions,
    machine: autoCompleteApi.autocompleteMachine,
};

const AutocompleteSearchField: React.FC<AutocompleteSearchFieldProps> = memo(
    ({type, label, minLength, value, onChange, onKeyPress, isMobile}) => {
        const [options, setOptions] = useState<string[]>([]);
        const [loading, setLoading] = useState(false);

        const {categoryId} = useCatalogStore();

        const getPlaceholderText = (lbl: string): string => `Enter ${lbl}...`;

        const fetchOptionsDebounced = useCallback(
            debounce(async (query: string) => {
                if (query.length === 0 || query.length < minLength || !categoryId) {
                    setOptions([]);
                    return;
                }

                setLoading(true);
                try {
                    const apiCall = apiMap[type];
                    const res = await apiCall(query, categoryId);
                    setOptions(res);
                } catch (error) {
                    console.error(`Error fetching autocomplete for ${type}:`, error);
                    setOptions([]);
                } finally {
                    setLoading(false);
                }
            }, 300),
            [type, minLength, categoryId]
        );

        useEffect(() => {
            return () => fetchOptionsDebounced.cancel();
        }, [fetchOptionsDebounced]);

        const handleInputChange = useCallback(
            (_: React.SyntheticEvent, newInputValue: string, reason: string) => {
                onChange(type, newInputValue);

                if (reason === 'input') void fetchOptionsDebounced(newInputValue);
                else if (reason === 'clear') {
                    setOptions([]);
                    fetchOptionsDebounced.cancel();
                }
            },
            [onChange, type, fetchOptionsDebounced]
        );

        const handleSelectChange = useCallback(
            (_: React.SyntheticEvent, newValue: string | null) => {
                onChange(type, newValue || '');
                setOptions([]);
                fetchOptionsDebounced.cancel();
            },
            [onChange, type, fetchOptionsDebounced]
        );

        const inputPropsSx = isMobile ? {
            borderRadius: 1,
            height: 50,
            backgroundColor: 'transparent',
            '& fieldset': {
                borderColor: 'grey.300',
            },
            '&:hover fieldset': {
                borderColor: 'grey.400',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
            },
        } : {
            height: '100%',
            borderRadius: 0,
            '& .MuiInputBase-input': {
                paddingTop: '12px !important',
                paddingBottom: '12px !important',
                paddingLeft: '14px !important',
                paddingRight: '4px !important',
            },
        };

        const textFieldSx = isMobile ? {
            '& .MuiOutlinedInput-root': {borderRadius: 1},
            mb: 0
        } : {
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
                height: '48px',
                borderRadius: 0,
                backgroundColor: 'transparent',
                '& fieldset': {border: 'none'},
            },
            '& .MuiInputBase-input': {
                py: 1.25,
                px: 1.5,
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

export default AutocompleteSearchField;