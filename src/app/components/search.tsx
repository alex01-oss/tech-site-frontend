import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
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

  // return (
  //   <TextField
  //     variant="outlined"
  //     placeholder={placeholder}
  //     onChange={handleSearch}
  //     value={searchItem}
  //     fullWidth
  //     InputProps={{
  //       startAdornment: (
  //         <InputAdornment position="start">
  //           <IconButton sx={{ color: "#6c757d" }}>
  //             <SearchIcon />
  //           </IconButton>
  //         </InputAdornment>
  //       ),
  //     }}
  //     sx={{ backgroundColor: "#FFF" }}
  //   />
  // );

  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      onChange={handleSearch}
      value={searchItem}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton sx={{ color: "primary.main" }}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        backgroundColor: "#FFF",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(78, 12, 30, 0.2)",
          },
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
          },
        },
      }}
    />
  );
}
