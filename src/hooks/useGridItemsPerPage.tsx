import {useEffect, useState} from 'react'

export function useGridItemsPerPage(): number | null {
    const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);

    useEffect(() => {
        function updateItemsPerPage() {
            const width = window.innerWidth;
            let value: number

            if (width >= 1536) {                // xl
                value = 12;
            } else if (width >= 1200) {         // lg
                value = 12;
            } else if (width >= 900) {          // md
                value = 9;
            } else if (width >= 600) {          // sm
                value = 6;
            } else {                            // xs
                value = 6;
            }

            setItemsPerPage(value);
        }

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, [])

    return itemsPerPage;
}