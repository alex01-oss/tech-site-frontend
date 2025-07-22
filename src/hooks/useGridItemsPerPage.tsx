import {useEffect, useState} from 'react'

export function useGridItemsPerPage(): number {
    const [itemsPerPage, setItemsPerPage] = useState(8);

    useEffect(() => {
        function updateItemsPerPage() {
            const width = window.innerWidth;
            console.log("Current window width (logical px):", width);
            console.log("Current itemsPerPage before update:", itemsPerPage);

            if (width >= 1536) {                // xl
                setItemsPerPage(12);
            } else if (width >= 1200) {         // lg
                setItemsPerPage(12);
            } else if (width >= 900) {          // md
                setItemsPerPage(9);
            } else if (width >= 600) {          // sm
                setItemsPerPage(6);
            } else {                            // xs
                setItemsPerPage(6);
            }
        }

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, [])

    return itemsPerPage;
}