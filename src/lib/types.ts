export interface SearchResult {
    site: string;
    siteName: string;
    productName: string;
    price: number;
    imageUrl: string;
    options: ProductOption[];
    url: string;
}

export interface ProductOption {
    size: string;
    price: number;
    stock: number;
}

export interface TagInfo {
    tag: string;
    count: number;
}

export interface MarketData {
    price: number;
    url: string;
    imageUrl: string;
    compareOption1?: string;
    compareOption2?: string;
    stock: number;
}

export interface GroupedResult {
    productId: string;
    productName: string;
    originalName?: string;
    options: {
        [size: string]: {
            markets: {
                [marketName: string]: MarketData;
            };
        };
    };
} 