import React from 'react'
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const posts = [
    {id: 1, title: 'Профільне шліфування', thumbnail: '/images/video_thumb_1.jpg'},
    {id: 2, title: 'Технологія виробництва', thumbnail: '/images/video_thumb_2.jpg'},
    {id: 3, title: 'Нові інструменти 2025', thumbnail: '/images/video_thumb_3.jpg'},
];

export default function BlogSection() {
    return (
        <Container maxWidth="lg" sx={{my: 6}}>
            <Typography variant="h3" component="h2" sx={{mb: 4, color: 'text.primary'}}>
                Our blog
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <Paper
                            sx={{
                                position: 'relative',
                                height: 200,
                                backgroundImage: `url(${post.thumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 8,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    zIndex: 2,
                                    textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                                }}
                            >
                                {post.title}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
