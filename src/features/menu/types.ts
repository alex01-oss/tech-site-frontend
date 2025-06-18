export interface MenuResponse {
    categories: MenuCategory[];
}

export interface MenuCategory {
    title: string;
    items: MenuItem[];
}

export interface MenuItem {
    text: string;
    items: MenuSubItem[];
}

export interface MenuSubItem {
    text: string;
    searchType?: string;
    type?: "button";
    url?: string;
}