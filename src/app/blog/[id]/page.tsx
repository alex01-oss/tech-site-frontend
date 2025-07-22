import {Post} from "@/features/blog/types";
import {notFound} from "next/navigation";
import {blogApi} from "@/features/blog/api";
import PostDetailPage from "@/components/layout/PostDetailPage";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

export default async function PostPage({params}: {params: { id: string }} ) {
    const postId = parseInt(params.id, 10);

    if (isNaN(postId)) {
        notFound()
    }

    let post: Post | null = null

    try {
        post = await blogApi.fetchPost(postId);

        if(!post) {
            notFound()
        }
    } catch (e) {
        console.error("Failed to fetch post data:", e)
        notFound()
    }

    return (
        <PostDetailPage post={post} baseApiUrl={BASE_API_URL} />
    );
}