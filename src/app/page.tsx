import {Box} from "@mui/material";
import AboutUsSection from "@/components/layout/AboutUsSection";
import CategoriesSection from "@/components/layout/CategoriesSection";
import BlogSection from "@/components/layout/BlogSection";
import VideosSection from "@/components/layout/VideosSection";

export default function Page() {
    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <AboutUsSection />
            <CategoriesSection />
            <BlogSection />
            <VideosSection />
        </Box>
    );
}