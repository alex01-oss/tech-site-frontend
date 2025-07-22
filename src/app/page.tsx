import {Box} from "@mui/material";
import AboutUsSection from "@/components/layout/AboutUsSection";
import CategoriesSection from "@/components/layout/CategoriesSection";
import BlogSection from "@/components/layout/BlogSection";
import VideosSection from "@/components/layout/VideosSection";
import {Post} from "@/features/blog/types";
import {blogApi} from "@/features/blog/api";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_UPLOADS_PLAYLIST_ID = 'UU3tUVI8r3Bfr8hb9-KzfCvw';

interface YouTubeVideo {
    id: { videoId: string };
    snippet: {
        title: string;
        thumbnails: {
            high: { url: string };
            medium: { url: string };
        };
    };
}

async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
    console.log("YouTube API Key:", YOUTUBE_API_KEY ? "Loaded" : "Not Loaded");

    if (!YOUTUBE_API_KEY || !YOUTUBE_UPLOADS_PLAYLIST_ID) {
        console.error("YouTube API Key or Playlist ID is missing.");
        return [];
    }

    const maxResults = 3;
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${YOUTUBE_UPLOADS_PLAYLIST_ID}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to fetch YouTube videos: ${response.status} ${response.statusText}. Response: ${errorText}`);
            return [];
        }
        const data = await response.json();
        console.log("Fetched YouTube data items:", data.items);

        const filteredVideos = data.items.filter(
            (item: any) => item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId
        );
        console.log("Filtered YouTube videos:", filteredVideos);
        return filteredVideos;

    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        return [];
    }
}

export default async function Page() {
    let posts: Post[] = [];
    let youtubeVideos: YouTubeVideo[] = [];

    try {
        posts = await blogApi.fetchAllPosts(3);

        if (!posts || posts.length === 0) {
            console.warn("No posts found from the API.");
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        posts = [];
    }

    try {
        youtubeVideos = await fetchYouTubeVideos();
        if (!youtubeVideos || youtubeVideos.length === 0) {
            console.warn("No YouTube videos found.");
        }
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        youtubeVideos = [];
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <AboutUsSection />
            <CategoriesSection />
            <BlogSection posts={posts} baseApiUrl={BASE_API_URL} />
            <VideosSection videos={youtubeVideos} />
        </Box>
    );
}