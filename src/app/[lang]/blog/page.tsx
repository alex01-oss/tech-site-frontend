import {blogApi} from '@/features/blog/api';
import {Post} from '@/features/blog/types';
import BlogPage from "@/components/blog/BlogPage";
import React from "react";
import {getDictionary} from "@/lib/i18n";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

interface Props {
    params: { lang: string };
}

export default async function Blog({ params: { lang } }: Props) {
    const dict = await getDictionary(lang);
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

    return (
        <BlogPage posts={posts} baseApiUrl={BASE_API_URL} dict={dict.blog.main}/>
    );
}