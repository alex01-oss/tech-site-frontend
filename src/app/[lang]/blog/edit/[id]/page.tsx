import React from 'react'
import {notFound} from "next/navigation";
import PostEditorPage from "@/components/blog/PostEditorPage";
import {getDictionary} from "@/lib/i18n";

interface Props {
    params: {
        id: string,
        lang: string
    }
}

export default async  function EditPostPage({params: {id, lang}}: Props) {
    const postId = parseInt(id, 10);
    const dict = await getDictionary(lang);

    if (isNaN(postId)) notFound()

    return <PostEditorPage mode="edit" postId={postId} dict={dict.blog.editor} />
}
