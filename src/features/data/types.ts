export interface Category {
    name: string;
    img_url: string;
}

export interface FilterItem {
    id: number;
    name: string;
}

export interface FilterResponse {
    [key: string]: FilterItem[];
}