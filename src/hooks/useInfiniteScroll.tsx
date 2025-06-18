import {useCatalogStore} from "@/features/catalog/store";
import {useInView} from "react-intersection-observer";
import {useEffect} from "react";

export const useInfiniteScroll = () => {
    const { isLoading, currentPage, totalPages, fetchCatalog } = useCatalogStore()

    const {ref, inView} = useInView({
        threshold: 0.5,
        triggerOnce: false,
    })

    useEffect(() => {
        if(inView && !isLoading && currentPage < totalPages) {
            useCatalogStore.getState().setPage(currentPage + 1)
            void fetchCatalog()
        }
    }, [inView]);

    return { ref }
};