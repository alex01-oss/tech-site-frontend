import {Stack} from "@mui/material";
import {AboutUsSection} from "@/components/home/AboutUsSection";
import {CategoriesSection} from "@/components/home/CategoriesSection";
import {BlogSection} from "@/components/home/BlogSection";
import {VideosSection} from "@/components/home/VideosSection";
import {Post} from "@/features/blog/types";
import {blogApi} from "@/features/blog/api";
import {Video} from "@/features/youtube/types";
import {youtubeApi} from "@/features/youtube/api";
import React from "react";
import { Category } from "@/features/data/types";
import { dataApi } from "@/features/data/api";

export default async function Page() {
    let posts: Post[] = [];
    let categories: Category[] = [];
    let youtubeVideos: Video[] = [];

    let postsError: string | null = null;
    let categoriesError: string | null = null;
    let videosError: string | null = null;

    try {
        posts = await blogApi.fetchPosts(3);

        if (!posts || posts.length === 0) {
            console.warn("No posts found from the API.");
        }
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        postsError = error.message;
        posts = [];
    }
    
    try {
        categories = await dataApi.getCategories();

        if (!categories || categories.length === 0) {
            console.warn("No categories found from the API.");
        }
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        categoriesError = error.message;
        categories = [];
    }

    try {
        youtubeVideos = await youtubeApi.fetchYouTubeVideos();
        if (!youtubeVideos || youtubeVideos.length === 0) {
            console.warn("No YouTube videos found.");
        }
    } catch (error: any) {
        console.error("Error fetching YouTube videos:", error);
        videosError = error.message;
        youtubeVideos = [];
    }

    return (
        <Stack spacing={4}>
            <AboutUsSection />
            <CategoriesSection 
                categories={categories}
                error={categoriesError}
            />
            <BlogSection
                posts={posts}
                error={postsError}
            />
            <VideosSection 
                videos={youtubeVideos}
                error={videosError}
            />
        </Stack>
    );
}