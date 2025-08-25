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
import {API_URL} from "@/constants/constants";

export default async function Page() {
    let posts: Post[] = [];
    let youtubeVideos: Video[] = [];

    try {
        posts = await blogApi.fetchPosts(3);

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
            <BlogSection
                posts={posts}
                baseApiUrl={API_URL}
                isLoading={false}
            />
            <VideosSection videos={youtubeVideos} />
        </Stack>
    );
}