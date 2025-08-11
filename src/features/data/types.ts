export interface Category {
    name: string;
    img_url: string;
}

export interface FilterItem {
    id: number;
    [key: string]: any;
}

export interface FilterResponse {
    [key: string]: FilterItem[];
}