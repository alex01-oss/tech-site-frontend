import {Stack} from "@mui/material";
import AboutUsSection from "@/components/home/AboutUsSection";
import {CategoriesSection} from "@/components/home/CategoriesSection";
import BlogSection from "@/components/home/BlogSection";
import VideosSection from "@/components/home/VideosSection";
import {Post} from "@/features/blog/types";
import {blogApi} from "@/features/blog/api";
import {Video} from "@/features/youtube/types";
import {youtubeApi} from "@/features/youtube/api";
import React from "react";
import {getDictionary} from "@/lib/i18n";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function Page({params}: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

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
            <AboutUsSection dict={dict.aboutUsSection} />
            <CategoriesSection dict={dict.categoriesSection} />
            <BlogSection
                dict={{
                    dialog: dict.blog.main.dialog,
                    blogSection: dict.blog.blogSection,
                }}
                posts={posts}
                baseApiUrl={BASE_API_URL}
                isLoading={false}
            />
            <VideosSection dict={dict.videosSection} videos={youtubeVideos} />
        </Stack>
    );
}