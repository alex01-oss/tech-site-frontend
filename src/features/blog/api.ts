import {DeletePostResponse, Post, PostRequest} from "@/features/blog/types";
import api from "@/lib/api";

export const blogApi = {
    fetchPosts: async (limit?: number): Promise<Post[]> => {
        const url = limit ? `blog?limit=${limit}` : "blog";
        const res = await api.get<Post[]>(url);
        return res.data;
    },

    fetchPost: async (id: number): Promise<Post> => {
        const res = await api.get<Post>(`blog/${id}`);
        return res.data;
    },

    createPost: async (postData: PostRequest): Promise<Post> => {
        const res = await api.post<Post>("blog", postData);
        return res.data;
    },

    editPost: async (id: number, postData: PostRequest): Promise<Post> => {
        const res = await api.put<Post>(`blog/${id}`, postData);
        return res.data;
    },

    deletePost: async (id: number): Promise<DeletePostResponse> => {
        const res = await api.delete<DeletePostResponse>(`blog/${id}`);
        return res.data;
    },
}