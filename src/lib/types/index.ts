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

export interface CacheItem {
    data: SearchResult[];
    timestamp: number;
}

export interface MarketData {
    siteName: string;
    price: number;
    imageUrl: string;
    options: ProductOption[];
    url: string;
}

export interface MarketInfo {
    siteName: string;
    price: number;
    imageUrl: string;
    url: string;
    stock: number;
    compareOption1: string;
    compareOption2: string;
}

export interface SizeOption {
    size: string;
    markets: {
        [marketType: string]: MarketInfo;
    }
}

export interface GroupedResult {
    productId: string;
    productName: string;
    options: {
        [size: string]: SizeOption;
    }
} 