import {useEffect, useState} from 'react'

export function useGridItemsPerPage(): number | null {
    const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);

    useEffect(() => {
        const breakpoints = [
            { width: 1536, value: 12 }, // xl
            { width: 1200, value: 12 }, // lg
            { width: 900, value: 9 },   // md
            { width: 600, value: 6 },   // sm
            { width: 0, value: 6 },     // xs
        ];

        function updateItemsPerPage() {
            const width = window.innerWidth;
            const { value } = breakpoints.find(bp => width >= bp.width) || { value: 6 };
            setItemsPerPage(value);
        }

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);

        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    return itemsPerPage;
}