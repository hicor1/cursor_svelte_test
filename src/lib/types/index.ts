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

export interface MarketPrice {
    기준_제품명_원문: string;
    기준_품번_1: string;
    기준_옵션_1: string;
    기준_마켓구분: string;
    비교_즉시구매가격: number;
    비교_재고량: number;
    비교_제품_URL: string;
    비교_이미지_URL: string;
    비교_옵션_1: string;
    비교_옵션_2: string;
}

export interface GroupedResult {
    productId: string;
    productName: string;
    options: {
        [size: string]: {
            markets: {
                [marketType: string]: {
                    siteName: string;
                    price: number;
                    stock: number;
                    url: string;
                    imageUrl: string;
                    compareOption1: string;
                    compareOption2: string;
                }
            }
        }
    }
} 