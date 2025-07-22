import {Video} from "@/features/youtube/types";


const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_UPLOADS_PLAYLIST_ID = 'UU3tUVI8r3Bfr8hb9-KzfCvw';

export const youtubeApi = {
    fetchYouTubeVideos: async (): Promise<Video[]> => {
        if (!YOUTUBE_API_KEY || !YOUTUBE_UPLOADS_PLAYLIST_ID) {
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

            return data.items.filter(
                (item: any) => item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId
            );

        } catch (error) {
            console.error("Error fetching YouTube videos:", error);
            return [];
        }
    }
}