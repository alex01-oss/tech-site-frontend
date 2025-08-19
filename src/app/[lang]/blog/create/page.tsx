import PostEditorPage from "@/components/blog/PostEditorPage";
import {getDictionary} from "@/lib/i18n";

export default async function CreatePostPage({params: {lang}}: { params: { lang: string } }) {
    const dict = await getDictionary(lang);

    return <PostEditorPage mode="create" dict={dict.blog.editor}/>;
}