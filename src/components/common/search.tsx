import React, {memo, useCallback, useEffect, useState} from "react";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface SearchField {
    id: string;
    value: string;
    type: string;
}

interface SearchProps {
    onSearch: (searchFields: SearchField[]) => void;
    initialSearchFields?: SearchField[];
}

const SEARCH_TYPE_OPTIONS = [
    { value: 'code', label: 'Code' },
    { value: 'shape', label: 'Shape' },
    { value: 'dimensions', label: 'Dimensions' },
    { value: 'machine', label: 'Machine' },
];

const getPlaceholderText = (type: string): string => {
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
};

const Search: React.FC<SearchProps> = memo(({
                                                onSearch,
                                                initialSearchFields = [{ id: 'field-0', value: '', type: 'code' }] // Початково одне поле
                                            }) => {
    const [searchFields, setSearchFields] = useState<SearchField[]>(initialSearchFields);

    useEffect(() => {
        if (initialSearchFields.length === 0) {
            setSearchFields([{ id: 'field-0', value: '', type: 'code' }]);
        } else {
            setSearchFields(initialSearchFields);
        }
    }, [initialSearchFields]);

    const handleValueChange = useCallback((id: string, newValue: string) => {
        setSearchFields(prevFields =>
            prevFields.map(field =>
                field.id === id ? { ...field, value: newValue } : field
            )
        );
    }, []);

    const handleTypeChange = useCallback((id: string, newType: string) => {
        setSearchFields(prevFields =>
            prevFields.map(field =>
                field.id === id ? { ...field, type: newType } : field
            )
        );
    }, []);

    const handleSearchSubmit = useCallback(() => {
        const activeSearchFields = searchFields.filter(field => field.value.trim() !== '');
        onSearch(activeSearchFields);
    }, [searchFields, onSearch]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    }, [handleSearchSubmit]);

    const handleClearField = useCallback((id: string) => {
        setSearchFields(prevFields =>
            prevFields.map(field =>
                field.id === id ? { ...field, value: '' } : field
            )
        );
    }, []);


    const handleAddField = useCallback(() => {
        const usedTypes = new Set(searchFields.map(f => f.type));
        const nextAvailableType = SEARCH_TYPE_OPTIONS.find(
            option => !usedTypes.has(option.value)
        );

        if (nextAvailableType) {
            setSearchFields(prevFields => [
                ...prevFields,
                { id: `field-${prevFields.length}-${Date.now()}`, value: '', type: nextAvailableType.value }
            ]);
        }
    }, [searchFields]);

    const handleDeleteField = useCallback((idToRemove: string) => {
        setSearchFields(prevFields => prevFields.filter(field => field.id !== idToRemove));
    }, []);

    const getAvailableSearchTypes = useCallback((currentFieldId: string) => {
        const usedTypes = new Set(
            searchFields
                .filter(field => field.id !== currentFieldId) // Виключаємо поточне поле
                .map(field => field.type)
        );
        return SEARCH_TYPE_OPTIONS.filter(option => !usedTypes.has(option.value));
    }, [searchFields]);


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'stretch' }}>
            {searchFields.map((field) => (
                <Box key={field.id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel id={`search-type-label-${field.id}`}>Search by</InputLabel>
                        <Select
                            labelId={`search-type-label-${field.id}`}
                            value={field.type}
                            onChange={(e) => handleTypeChange(field.id, e.target.value as string)}
                            label="Search by"
                            sx={{ borderRadius: 2 }}
                        >
                            {getAvailableSearchTypes(field.id).map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {getAvailableSearchTypes(field.id).length === 0 && (
                            <FormHelperText error>No other search types available</FormHelperText>
                        )}
                    </FormControl>

                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={getPlaceholderText(field.type)}
                        value={field.value}
                        onChange={(e) => handleValueChange(field.id, e.target.value)}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <>
                                    {field.value && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleClearField(field.id)}
                                                aria-label="Clear"
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )}
                                    {searchFields.length > 1 && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteField(field.id)}
                                                aria-label="Delete search field"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )}
                                </>
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
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {searchFields.length < SEARCH_TYPE_OPTIONS.length && (
                    <Button
                        variant="outlined"
                        onClick={handleAddField}
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: 2 }}
                    >
                        Add Search Field
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={handleSearchSubmit}
                    startIcon={<SearchIcon />}
                    sx={{ borderRadius: 2 }}
                >
                    Search
                </Button>
            </Box>
        </Box>
    );
});

Search.displayName = "Search";
export default Search;