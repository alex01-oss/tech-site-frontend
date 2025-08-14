import {blogApi} from '@/features/blog/api';
import {Post} from '@/features/blog/types';
import BlogGrid from "@/components/layout/BlogGrid";
import {Toolbar} from "@mui/material";
import React from "react";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

export default async function BlogPage() {
    let posts: Post[] = [];

    try {
        posts = await blogApi.fetchAllPosts();

        if (!posts || posts.length === 0) {
            console.warn("No blog posts found for the main blog page.");
        }
    } catch (error) {
        console.error("Error fetching all blog posts:", error);
        posts = [];
    }

    return (
        <BlogGrid posts={posts} baseApiUrl={BASE_API_URL}/>
    );
}