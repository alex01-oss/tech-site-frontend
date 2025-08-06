"use server"

import { revalidatePath } from 'next/cache';

export async function revalidateBlogPosts() {
    revalidatePath('/blog');
    console.log('Blog posts revalidated!');
}