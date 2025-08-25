import {Post} from "@/features/blog/types";
import {notFound} from "next/navigation";
import {blogApi} from "@/features/blog/api";
import {PostDetailPage} from "@/components/blog/PostDetailPage";
import React from "react";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

interface Props {
    params: Promise<{
        id: string,
    }>
}

export default async function PostPage({ params }: Props) {
    const { id } = await params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) notFound()

    let post: Post | undefined = undefined;
    try {
        post = await blogApi.fetchPost(postId);
    } catch (e) {
        console.error("Failed to fetch post data on server:", e);
    }

    return (
        <PostDetailPage
            initialPost={post}
            postId={postId}
            baseApiUrl={BASE_API_URL}
        />
    );
}