"use client";

import React, {useMemo} from 'react';
import {Box, Fab, IconButton, InputAdornment, TextField, Typography, useTheme} from '@mui/material';
import {Post} from '@/features/blog/types';
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {PostCard} from "@/components/blog/PostCard";
import AddIcon from '@mui/icons-material/Add';
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {useAuthStore} from "@/features/auth/store";
import {useDictionary} from "@/providers/DictionaryProvider";

export const BlogPage: React.FC<{ posts: Post[]; }> = ({posts}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const router = useNavigatingRouter();
    const dict = useDictionary();
    const theme = useTheme();
    const {user} = useAuthStore();

    const filteredPosts = useMemo(() => {
        if (!searchTerm) return posts;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return posts.filter((post) =>
            post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            post.content.toLowerCase().includes(lowerCaseSearchTerm)
        )
    }, [posts, searchTerm])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleSearchClear = () => setSearchTerm('')

    return (
        <Box>
            <Typography variant="h2" component="h1" align="center"
                        sx={{color: 'text.primary', fontWeight: theme.typography.fontWeightBold}}>
                {dict.blog.title}
            </Typography>

            <Box sx={{display: 'flex', justifyContent: 'center', my: {xs: theme.spacing(2), sm: theme.spacing(3)}}}>
                <TextField
                    variant="outlined"
                    placeholder={dict.blog.placeholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{width: '100%'}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            searchTerm ? (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearchClear} edge="end" size="small"
                                                aria-label={dict.common.clear}>
                                        <ClearIcon/>
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        )
                    }}
                />
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    },
                }}
            >
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post: Post) => (
                        <Box key={post.id}>
                            <PostCard
                                post={post}
                                height={300}
                                showAdminControls={true}
                                elevation={4}
                                showDescription={true}
                            />
                        </Box>
                    ))
                ) : (
                    <Box sx={{gridColumn: '1 / -1'}}>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            align="center"
                            sx={{mt: theme.spacing(4)}}
                            role="status"
                        >
                            {searchTerm ? `${dict.blog.notFound} "${searchTerm}".` : dict.blog.empty}
                        </Typography>
                    </Box>
                )}
            </Box>

            {user && user.role === 'admin' && (
                <Fab
                    color="secondary"
                    aria-label={dict.common.add}
                    sx={{
                        position: 'fixed',
                        borderRadius: theme.shape.borderRadius,
                        bottom: {xs: theme.spacing(2), sm: theme.spacing(3), lg: theme.spacing(6.5)},
                        right: {xs: theme.spacing(2), sm: theme.spacing(3), lg: theme.spacing(6.5)},
                    }}
                    onClick={() => router.push('/blog/create')}
                >
                    <AddIcon/>
                </Fab>
            )}
        </Box>
    );
};