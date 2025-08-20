import PostEditorPage from "@/components/blog/PostEditorPage";
import {getDictionary} from "@/lib/i18n";

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function CreatePostPage({params}: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <PostEditorPage mode="create" dict={dict.blog.editor}/>;
}