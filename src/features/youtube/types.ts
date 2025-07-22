export interface Video {
    id: string;
    snippet: {
        title: string;
        thumbnails: {
            high: { url: string };
            medium: { url: string };
        };
        resourceId: {
            videoId: string;
        };
    };
}
