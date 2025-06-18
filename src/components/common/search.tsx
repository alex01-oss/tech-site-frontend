import React, {memo, useCallback, useState} from 'react';
import {Box, IconButton, InputAdornment, TextField} from '@mui/material';
import {Clear, Search as SearchIcon} from '@mui/icons-material';

interface SearchProps {
    placeholder: string;
    onSearch: (query: string, type: string) => void;
    searchType: string;
    value: string;
}

const Search: React.FC<SearchProps> = memo(({
    placeholder, onSearch, searchType, value
}) => {
    const [inputValue, setInputValue] = useState(value);

    const handleSearch = useCallback(() => {
        onSearch(inputValue.trim(), searchType);
    }, [inputValue, searchType, onSearch]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    const handleClear = useCallback(() => {
        setInputValue('');
        onSearch('', searchType);
    }, [onSearch, searchType]);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action"/>
                        </InputAdornment>
                    ),
                    endAdornment: inputValue && (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                aria-label="Clear search"
                            >
                                <Clear/>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                    }
                }}
            />
        </Box>
    );
});

Search.displayName = "Search";
export default Search;