import {blogApi} from '@/features/blog/api';
import {Post} from '@/features/blog/types';
import {BlogPage} from "@/components/blog/BlogPage";
import React from "react";

export default async function Blog() {
    let posts: Post[] = [];

    try {
        posts = await blogApi.fetchPosts();

        if (!posts || posts.length === 0) {
            console.warn("No blog posts found for the main blog page.");
        }
    } catch (error) {
        console.error("Error fetching all blog posts:", error);
        posts = [];
    }

    return <BlogPage posts={posts} />
}