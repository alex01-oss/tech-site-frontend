import React, { useState } from "react";
import { InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../styles/search.module.css";

interface SearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch = () => {},
  placeholder = "Search...",
}: SearchProps) {
  const [searchItem, setSearchItem] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchItem(query);

    if (timer) clearTimeout(timer);

    setTimer(
      setTimeout(() => {
        onSearch(query);
      }, 500)
    );
  };

  return (
    <div className={styles.searchBarContainer}>
      <IconButton className={styles.searchIconButton}>
        <SearchIcon className={styles.searchIcon} />
      </IconButton>
      <InputBase
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        onChange={handleSearch}
        className={styles.searchInput}
        value={searchItem}
      />
    </div>
  );
}
