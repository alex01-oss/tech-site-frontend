import {Stack} from "@mui/material";
import AboutUsSection from "@/components/layout/AboutUsSection";
import {CategoriesSection} from "@/components/layout/CategoriesSection";
import BlogSection from "@/components/layout/BlogSection";
import VideosSection from "@/components/layout/VideosSection";
import {Post} from "@/features/blog/types";
import {blogApi} from "@/features/blog/api";
import {Video} from "@/features/youtube/types";
import {youtubeApi} from "@/features/youtube/api";
import React from "react";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

export default async function Page() {
    let posts: Post[] = [];
    let youtubeVideos: Video[] = [];

    try {
        posts = await blogApi.fetchAllPosts(3);

        if (!posts || posts.length === 0) {
            console.warn("No posts found from the API.");
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        posts = [];
    }

    try {
        youtubeVideos = await youtubeApi.fetchYouTubeVideos();
        if (!youtubeVideos || youtubeVideos.length === 0) {
            console.warn("No YouTube videos found.");
        }
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        youtubeVideos = [];
    }

    return (
        <Stack spacing={4}>
            <AboutUsSection />
            <CategoriesSection />
            <BlogSection posts={posts} baseApiUrl={BASE_API_URL} isLoading={false} />
            <VideosSection videos={youtubeVideos} />
        </Stack>
    );
}