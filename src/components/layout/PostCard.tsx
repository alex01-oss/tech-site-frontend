"use client";

import React, {useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    darken,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Typography,
    useTheme
} from '@mui/material';
import Image from 'next/image';
import EditIcon from "@mui/icons-material/Edit";
import {Post} from '@/features/blog/types';
import {useAuthStore} from "@/features/auth/store";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import DeleteIcon from "@mui/icons-material/Delete";
import {blogApi} from '@/features/blog/api';
import {enqueueSnackbar} from "notistack";
import {revalidateBlogPosts} from "@/actions/actions";

interface PostCardProps {
    post: Post;
    baseApiUrl: string;
    height?: number;
    showAdminControls?: boolean;
    elevation?: number;
    showDescription?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    baseApiUrl,
    height = 300,
    showAdminControls = false,
    elevation = 4,
    showDescription = true,
}) => {
    const router = useNavigatingRouter();
    const {user} = useAuthStore();
    const theme = useTheme();

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await blogApi.deletePost(post.id);
            enqueueSnackbar('Post deleted successfully!', {variant: 'success'});
            await revalidateBlogPosts();
            handleCloseDeleteDialog();
        } catch (error) {
            enqueueSnackbar('Failed to delete post.', {variant: 'error'});
            console.error('Failed to delete post:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Paper
                elevation={elevation}
                sx={{
                    position: 'relative',
                    height: height,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                    },
                }}
                onClick={() => router.push(`/blog/${post.id}`)}
            >
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                }}>
                    <Image
                        src={post.image ? `${baseApiUrl}/${post.image}` : '/placeholder-image.png'}
                        alt={post.title}
                        fill
                        style={{objectFit: 'cover'}}
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    />
                </Box>

                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                    zIndex: 1,
                }}/>

                {showAdminControls && user?.role === 'admin' && (
                    <Box sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 3,
                        display: 'flex',
                        gap: 2,
                    }}>
                        <IconButton
                            aria-label="edit post"
                            sx={{
                                borderRadius: 1,
                                color: 'white',
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: darken(theme.palette.primary.main, 0.2),
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/blog/edit/${post.id}`);
                            }}
                        >
                            <EditIcon/>
                        </IconButton>

                        <IconButton
                            aria-label="delete post"
                            sx={{
                                borderRadius: 1,
                                color: 'white',
                                bgcolor: 'secondary.main',
                                '&:hover': {
                                    bgcolor: darken(theme.palette.secondary.main, 0.2),
                                },
                            }}
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <CircularProgress size={24} color="inherit"/> : <DeleteIcon/>}
                        </IconButton>
                    </Box>
                )}

                <Box sx={{
                    position: 'relative',
                    p: 2,
                    pt: 4,
                    zIndex: 2,
                    color: 'white',
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                            mb: 1,
                        }}
                    >
                        {post.title}
                    </Typography>
                    {showDescription && (
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.8,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                            }}
                        >
                            {post.content.length > 100 ? `${post.content.replace(/<[^>]*>/g, '').substring(0, 97)}...` : post.content.replace(/<[^>]*>/g, '')}
                        </Typography>
                    )}
                </Box>
            </Paper>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete the post "{post.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary" disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" disabled={isDeleting} autoFocus>
                        {isDeleting ? <CircularProgress size={24}/> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PostCard;