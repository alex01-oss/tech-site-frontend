import React, { useState } from "react";
import { InputBase, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchProps {
  onSearch?: (query: string, category: string, searchType: string) => void;
  category: string;
  searchType: string;
  placeholder?: string;
}

export default function SearchBar({
  onSearch = () => {},
  placeholder = "Search...",
  category,
  searchType,
}: SearchProps) {
  const [searchItem, setSearchItem] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchItem(query);

    if (timer) clearTimeout(timer);

    setTimer(
      setTimeout(() => {
        onSearch(query, category, searchType);
      }, 500)
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <IconButton sx={{ padding: 0, color: "#6c757d" }}>
        <SearchIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <InputBase
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        onChange={handleSearch}
        sx={{
          marginLeft: 1,
          width: "100%",
          fontSize: "16px",
          "& .MuiInputBase-input": {
            padding: "0px",
          },
        }}
        value={searchItem}
      />
    </Box>
  );
}
