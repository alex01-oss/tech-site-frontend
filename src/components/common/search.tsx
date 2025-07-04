import React, { memo, useCallback, useEffect, useState } from "react";
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Clear from '@mui/icons-material/Clear';

interface SearchProps {
    onSearch: (query: string, type: string) => void;
    onSearchTypeChange: (type: string) => void;
    searchType: string;
    value: string;
}

const SEARCH_TYPE_OPTIONS = [
    { value: 'code', label: 'Code' },
    { value: 'shape', label: 'Shape' },
    { value: 'dimensions', label: 'Dimensions' },
    { value: 'machine', label: 'Machine' },
];

const Search: React.FC<SearchProps> = memo(({
                                                onSearch, searchType, value, onSearchTypeChange
                                            }) => {
    const [inputValue, setInputValue] = useState(value);
    const [selectedSearchType, setSelectedSearchType] = useState(searchType);

    const getPlaceholderText = useCallback((type: string): string => {
        switch (type) {
            case "code":
                return "Enter code...";
            case "shape":
                return "Enter shape...";
            case "dimensions":
                return "Enter dimensions...";
            case "machine":
                return "Enter machine...";
            default:
                return "Type search query here...";
        }
    }, []);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        setSelectedSearchType(searchType);
    }, [searchType]);

    const handleSearchClick = useCallback(() => {
        onSearch(inputValue.trim(), selectedSearchType);
    }, [inputValue, selectedSearchType, onSearch]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    }, [handleSearchClick]);

    const handleClear = useCallback(() => {
        setInputValue('');
        onSearch('', selectedSearchType);
    }, [onSearch, selectedSearchType]);

    const handleSearchTypeChange = useCallback((event: any) => {
        const newType = event.target.value as string;
        setSelectedSearchType(newType);
        onSearchTypeChange(newType);
    }, [onSearchTypeChange]);

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="search-type-label">Search by</InputLabel>
                <Select
                    labelId="search-type-label"
                    value={selectedSearchType}
                    onChange={handleSearchTypeChange}
                    label="Search by"
                    sx={{ borderRadius: 2 }}
                >
                    {SEARCH_TYPE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                variant="outlined"
                placeholder={getPlaceholderText(selectedSearchType)}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: inputValue && (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                aria-label="Clear"
                            >
                                <Clear />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                    },
                    flexGrow: 1
                }}
            />
        </Box>
    );
});

export default Search;