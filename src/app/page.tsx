import HomePage from "@/app/home/page";
import { CatalogInitializer } from "./home/initializer";

export default function Page() {
    return (
        <>
            <CatalogInitializer />
            <HomePage />
        </>
    );
}