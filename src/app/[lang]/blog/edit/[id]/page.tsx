import React from 'react'
import {notFound} from "next/navigation";
import {PostEditorPage} from "@/components/blog/PostEditorPage";

interface Props {
    params: Promise<{
        id: string,
    }>
}

export default async  function EditPostPage({ params }: Props) {
    const { id } = await params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) notFound()

    return <PostEditorPage mode="edit" postId={postId} />
}
