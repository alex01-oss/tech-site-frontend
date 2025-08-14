'use client';

import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import Image from 'next/image';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    IconButton,
    TextField,
    Toolbar,
    Typography,
    useTheme
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import {blogApi} from "@/features/blog/api";
import {mediaApi} from '@/features/media/api';
import {PostRequest} from "@/features/blog/types";
import {revalidateBlogPosts} from "@/actions/actions";
import {Editor as TinyMCEEditor} from "tinymce";
import {Editor} from "@tinymce/tinymce-react";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";


const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";
const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY?.trim() || "";

interface PostEditorFormState {
    title: string;
    content: string;
    imageFile: File | null;
    imageUrl: string | null;
}

type PostEditorMode = 'create' | 'edit';

interface PostEditorProps {
    mode: PostEditorMode;
    postId?: number;
}

const PostEditor: React.FC<PostEditorProps> = ({mode, postId}) => {
    const router = useNavigatingRouter();
    const {enqueueSnackbar} = useSnackbar();

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const [formState, setFormState] = useState<PostEditorFormState>({
        title: '',
        content: '',
        imageFile: null,
        imageUrl: null,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const isNewPost = mode === 'create';
    const hasImage = !!formState.imageFile || !!formState.imageUrl;

    const previewImage = formState.imageFile
        ? URL.createObjectURL(formState.imageFile)
        : `${BASE_API_URL}/${formState.imageUrl}`;

    const editorRef = React.useRef<TinyMCEEditor | null>(null)
    const [editorKey, setEditorKey] = useState(0);

    useEffect(() => {
        setEditorKey(prevKey => prevKey + 1);
    }, [isDarkMode]);

    useEffect(() => {
        if (mode === 'edit' && postId) {
            setIsLoading(true);
            blogApi.fetchPost(postId)
                .then(post => {
                    setFormState({
                        title: post.title,
                        content: post.content,
                        imageFile: null,
                        imageUrl: post.image || null,
                    });
                })
                .catch(err => {
                    console.error('Failed to fetch post for editing:', err);
                    setError(err.message || 'Failed to load post data.');
                    enqueueSnackbar('Failed to load post data.', {variant: 'error'});
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (mode === 'create') {
            setFormState({
                title: '',
                content: '',
                imageFile: null,
                imageUrl: null,
            });
        }
    }, [mode, postId, enqueueSnackbar]);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({...prev, title: e.target.value}));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormState(prev => ({...prev, imageFile: file, imageUrl: null}));
        }
    };

    const handleClearImage = () => {
        if (formState.imageFile) {
            URL.revokeObjectURL(formState.imageFile.name);
        }
        setFormState(prev => ({...prev, imageFile: null, imageUrl: null}));
    };

    const handleSavePost = useCallback(async () => {
        setError(null);

        if (!formState.title.trim()) {
            enqueueSnackbar('Post title cannot be empty.', {variant: 'error'});
            return;
        }

        const htmlContent = editorRef.current ? editorRef.current.getContent() : '';

        if (!htmlContent.trim()) {
            enqueueSnackbar('Post content cannot be empty.', {variant: 'error'});
            return;
        }

        setIsSaving(true);
        try {
            let finalImageUrl = formState.imageUrl;

            if (formState.imageFile) {
                const uploadResponse = await mediaApi.uploadImage(formState.imageFile);
                finalImageUrl = uploadResponse.url;
            } else if (formState.imageUrl === null && hasImage) {
                finalImageUrl = null;
            }

            const postData: PostRequest = {
                title: formState.title,
                content: htmlContent,
                image: finalImageUrl,
            };

            if (isNewPost) {
                await blogApi.createPost(postData);
                enqueueSnackbar('Post created successfully!', {variant: 'success'});
            } else if (postId) {
                await blogApi.editPost(postId, postData);
                enqueueSnackbar('Post updated successfully!', {variant: 'success'});
            }

            await revalidateBlogPosts();
            router.push('/blog');
        } catch (err: any) {
            console.error('Failed to save post:', err);
            setError(err.message || 'Failed to save post.');
            enqueueSnackbar(`Failed to save post: ${err.message || 'Unknown error'}`, {variant: 'error'});
        } finally {
            setIsSaving(false);
        }
    }, [formState, isNewPost, postId, router, enqueueSnackbar, hasImage]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
                <Typography variant="h6" sx={{ml: 2}}>Loading post...</Typography>
            </Box>
        );
    }

    if (error && mode === 'edit') {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={() => router.back()} sx={{mt: 2}}>Go Back</Button>
            </Box>
        );
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: {xs: 2, sm: 3}}}>
            <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={formState.title}
                onChange={handleTitleChange}
                required
            />

            <Card variant="outlined" sx={{borderRadius: 1}}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Image</Typography>
                    <input
                        accept="image/*"
                        style={{display: 'none'}}
                        id="upload-image-button"
                        type="file"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="upload-image-button">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<AddPhotoAlternateIcon/>}
                        >
                            {hasImage ? 'Change Image' : 'Pick Image'}
                        </Button>
                    </label>

                    {hasImage && previewImage && (
                        <Box sx={{mt: 2, position: 'relative', width: '100%', height: 200}}>
                            <Image
                                src={previewImage}
                                alt="Post Preview"
                                fill
                                style={{objectFit: 'cover', borderRadius: '4px'}}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <IconButton
                                onClick={handleClearImage}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    '&:hover': {backgroundColor: 'rgba(255,255,255,0.9)'}
                                }}
                            >
                                <DeleteIcon color="error"/>
                            </IconButton>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Card variant="outlined" sx={{borderRadius: 1}}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Content Editor</Typography>
                    <Editor
                        key={editorKey}
                        onInit={(_, editor) => editorRef.current = editor}
                        value={formState.content || ''}
                        onEditorChange={(newValue) => {
                            setFormState(prev => ({...prev, content: newValue}));
                        }}
                        apiKey={TINYMCE_API_KEY}
                        init={{
                            directionality: 'ltr',
                            height: 500,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            skin: isDarkMode ? 'oxide-dark' : 'oxide',
                            content_style: isDarkMode
                                ? `
                                    body { font-family: Helvetica,Arial,sans-serif; font-size: 14px; background-color: #1e1e1e; color: #ffffff; }
                                    h1, h2, h3, h4, h5, h6, p, a { color: #ffffff; }
                                `
                                : `
                                    body { font-family: Helvetica,Arial,sans-serif; font-size: 14px; background-color: #ffffff; color: #000000; }
                                    h1, h2, h3, h4, h5, h6, p, a { color: #000000; }
                                `,
                        }}
                    />
                </CardContent>
            </Card>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSavePost}
                disabled={isSaving}
                fullWidth
                startIcon={<SaveIcon/>}
            >
                {isSaving ? <CircularProgress size={24}/> : (isNewPost ? 'Create Post' : 'Update Post')}
            </Button>
        </Box>
    );
};

export default PostEditor;