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
import {useDictionary} from "@/providers/DictionaryProvider";
import {API_URL} from "@/constants/constants";

interface PostCardProps {
    post: Post;
    height?: number;
    showAdminControls?: boolean;
    elevation?: number;
    showDescription?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    height = 300,
    showAdminControls = false,
    elevation = 4,
    showDescription = true,
}) => {
    const router = useNavigatingRouter();
    const {user} = useAuthStore();
    const theme = useTheme();
    const dict = useDictionary()

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleting(false);
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await blogApi.deletePost(post.id);
            enqueueSnackbar(dict.blog.dialog.deleteSuccess, {variant: 'success'});
            await revalidateBlogPosts();
            handleCloseDeleteDialog();
        } catch (error) {
            enqueueSnackbar(dict.blog.dialog.deleteError, {variant: 'error'});
            console.error('Failed to delete post:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Box>
            <Paper
                elevation={elevation}
                sx={{
                    position: 'relative',
                    height: height,
                    borderRadius: theme.shape.borderRadius,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    transition: theme.transitions.create(['transform', 'box-shadow']),
                    '&:hover': {
                        boxShadow: theme.shadows[8],
                    },
                }}
                onClick={() => router.push(`/blog/${post.id}`)}
                role="article"
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
                        src={post.image ? `${API_URL}/${post.image}` : '/placeholder-image.png'}
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
                    background: `linear-gradient(to top, ${theme.palette.text.primary}cc, ${theme.palette.text.primary}00)`,
                    zIndex: 1,
                }}/>

                {showAdminControls && user?.role === 'admin' && (
                    <Box sx={{
                        position: 'absolute',
                        top: theme.spacing(2),
                        right: theme.spacing(2),
                        zIndex: 3,
                        display: 'flex',
                        gap: theme.spacing(2),
                    }}>
                        <IconButton
                            aria-label={dict.common.edit}
                            sx={{
                                borderRadius: theme.shape.borderRadius,
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
                            aria-label={dict.blog.dialog.delete}
                            sx={{
                                borderRadius: theme.shape.borderRadius,
                                color: 'white',
                                bgcolor: 'secondary.main',
                                '&:hover': {
                                    bgcolor: darken(theme.palette.secondary.main, 0.2),
                                },
                            }}
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <CircularProgress size={24} color="inherit" aria-label={dict.common.deleting} /> : <DeleteIcon/>}
                        </IconButton>
                    </Box>
                )}

                <Box sx={{
                    position: 'relative',
                    p: theme.spacing(2),
                    pt: theme.spacing(4),
                    zIndex: 2,
                    color: theme.palette.common.white,
                }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            fontWeight: theme.typography.fontWeightBold,
                            textShadow: `1px 1px 4px ${theme.palette.text.primary}`,
                            mb: theme.spacing(1),
                        }}
                    >
                        {post.title}
                    </Typography>
                    {showDescription && (
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.8,
                                textShadow: `1px 1px 2px ${theme.palette.text.primary}`,
                            }}
                        >
                            {post.content.length > 100
                                ? `${post.content.replace(/<[^>]*>/g, '').substring(0, 97)}...`
                                : post.content.replace(/<[^>]*>/g, '')}
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
                    {dict.blog.dialog.delete}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        {dict.blog.dialog.confirmText} "{post.title}"? {dict.blog.dialog.irreversible}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary" disabled={isDeleting}>
                        {dict.common.cancel}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" disabled={isDeleting} autoFocus>
                        {isDeleting
                            ? <CircularProgress size={theme.typography.fontSize * 1.5} aria-label={dict.common.deleting} />
                            : dict.common.delete}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};