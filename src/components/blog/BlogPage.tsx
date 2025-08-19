"use client";

import React, {useMemo} from 'react';
import {Box, Fab, Grid, IconButton, InputAdornment, TextField, Typography} from '@mui/material';
import {Post} from '@/features/blog/types';
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {PostCard} from "@/components/blog/PostCard";
import AddIcon from '@mui/icons-material/Add';
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {useAuthStore} from "@/features/auth/store";

interface BlogGridProps {
    posts: Post[];
    baseApiUrl: string;
    dict: {
        title: string,
        placeholder: string,
        notFound: string,
        empty: string,
        add: string,
        dialog: any,
    }
}

export default function BlogPage({posts, baseApiUrl, dict}: BlogGridProps) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const router = useNavigatingRouter();
    const { user } = useAuthStore();

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
        <>
            <Box>
                <Typography variant="h2" component="h1" align="center" sx={{ color: 'text.primary', fontWeight: 700}}>
                    {dict.title}
                </Typography>

                <Box sx={{display: 'flex', justifyContent: 'center', my: {xs: 2, sm: 3}}}>
                    <TextField
                        variant="outlined"
                        placeholder={dict.placeholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{width: '100%'}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                searchTerm ? (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleSearchClear} edge="end" size="small">
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            )
                        }}
                    />
                </Box>

                <Grid container spacing={{xs: 2, sm: 3}}>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post: Post) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                <PostCard
                                    post={post}
                                    baseApiUrl={baseApiUrl}
                                    height={300}
                                    showAdminControls={true}
                                    elevation={4}
                                    showDescription={true}
                                    dict={dict.dialog}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="h6" color="text.secondary" align="center" sx={{mt: 4}}>
                                {searchTerm ? `${dict.notFound} "${searchTerm}".` : dict.empty}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {user && user.role === 'admin' && (
                <Fab
                    color="secondary"
                    aria-label={dict.add}
                    sx={{
                        position: 'fixed',
                        borderRadius: 1,
                        bottom: {xs: 16, sm: 24, lg: 52},
                        right: {xs: 16, sm: 24, lg: 52},
                    }}
                    onClick={() => {router.push('/blog/create')}}
                >
                    <AddIcon />
                </Fab>
            )}
        </>
    );
}