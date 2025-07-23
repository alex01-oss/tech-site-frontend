import React from 'react'
import {notFound} from "next/navigation";
import PostEditor from "@/components/layout/PostEditor";

export default function EditPostPage({params}: { params: { id: string }}) {
    const postId = parseInt(params.id, 10);

    if (isNaN(postId)) notFound()

    return <PostEditor mode="edit" postId={postId} />
}
