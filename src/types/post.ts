export interface Post {
    id: number;
    title: string;
    content: string;
    image?: string;
    created_at: string;
    updated_at: string;
    user_id: number;
}