"use client";

import React, {useMemo} from 'react';
import {Box, Container, Fab, Grid, IconButton, InputAdornment, TextField, Typography} from '@mui/material';
import {Post} from '@/features/blog/types';
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PostCard from "@/components/layout/PostCard";
import AddIcon from '@mui/icons-material/Add';
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {useAuthStore} from "@/features/auth/store";

interface BlogGridProps {
    posts: Post[];
    baseApiUrl: string;
}

export default function BlogGrid({posts, baseApiUrl}: BlogGridProps) {
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

    const handleSearchClear = () => {
        setSearchTerm('')
    }

    return (
        <>
            <Container maxWidth="lg" sx={{
                minHeight: 'calc(100vh - 120px)',
                position: 'relative'
            }}>
                <Typography variant="h2" component="h1" align="center" sx={{ color: 'text.primary', fontWeight: 700}}>
                    Our Blog
                </Typography>

                <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}>
                    <TextField
                        variant="outlined"
                        placeholder={"Search posts..."}
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

                <Grid container spacing={4}>
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
                                />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="h6" color="text.secondary" align="center" sx={{mt: 4}}>
                                {searchTerm ? `Nothing found for "${searchTerm}".` : 'There are no blog posts yet.'}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>

            {user && user.role === 'admin' && (
                <Fab
                    color="secondary"
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                    }}
                    onClick={() => {router.push('/blog/create')}}
                >
                    <AddIcon />
                </Fab>
            )}
        </>
    );
}