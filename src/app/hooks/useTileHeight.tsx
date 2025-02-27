import { useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

const useTileHeight = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tileHeight, setTileHeight] = useState("50px");
  const [prevHeight, setPrevHeight] = useState<number | null>(null);

  useEffect(() => {
    const calculateTileHeight = () => {
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;

      if (prevHeight === null || Math.abs(viewportHeight - prevHeight) > 150) {
        setPrevHeight(viewportHeight);

        const desiredRows = isMobile ? 8 : 10;
        const navbarHeight = 60;
        const paginationHeight = 50;
        const searchBarHeight = 60;
        const padding = 30;

        const availableHeight =
          viewportHeight -
          navbarHeight -
          paginationHeight -
          searchBarHeight -
          padding;
        const calculatedHeight = Math.max(
          40,
          Math.floor(availableHeight / desiredRows)
        );

        setTileHeight(`${calculatedHeight}px`);
      }
    };

    const handleResize = () => {
      requestAnimationFrame(calculateTileHeight);
    };

    if (prevHeight === null) {
      setTimeout(calculateTileHeight, 50);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, prevHeight]);

  return tileHeight;
};

export default useTileHeight;
