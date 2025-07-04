export interface MenuCategory {
    title: string;
    items: MenuItem[];
}

export interface MenuItem {
    text: string;
    type: "button";
    searchType: string;
    searchValue: string;
}
