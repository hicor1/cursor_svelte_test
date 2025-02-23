import type { SearchResult } from '$lib/types';
import { GOOGLE_SHEET_ID, GOOGLE_API_KEY } from '$env/static/private';

const SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/시트1!A1:AB?key=${GOOGLE_API_KEY}`;

interface GroupedResult {
    productId: string;
    productName: string;
    options: {
        [size: string]: {
            markets: {
                [marketType: string]: {
                    siteName: string;
                    price: number;
                    imageUrl: string;
                    url: string;
                    stock: number;
                    compareOption1: string;
                    compareOption2: string;
                }
            }
        }
    }
}

// 이미지 URL이 없거나 유효하지 않은 경우를 체크
const getValidImageUrl = (url: string) => {
    if (!url || url.trim() === '') return '';  // 빈 문자열 반환
    return url;
};

export async function searchProducts(query: string): Promise<GroupedResult[]> {
    try {
        const response = await fetch(SHEETS_API_URL);
        const data = await response.json();
        
        if (!data.values) return [];

        const [headers, ...rows] = data.values as string[][];
        
        // 컬럼 인덱스 찾기
        const productIdIndex = headers.findIndex(header => header === '기준_품번_1');
        const baseOptionIndex = headers.findIndex(header => header === '기준_옵션_1');  // 그룹핑용
        const compareOption1Index = headers.findIndex(header => header === '비교_옵션_1');  // 표시용
        const compareOption2Index = headers.findIndex(header => header === '비교_옵션_2');  // 표시용
        const marketTypeIndex = headers.findIndex(header => header === '비교_마켓구분');
        const imageUrlIndex = headers.findIndex(header => header === '비교_이미지_URL');
        const priceIndex = headers.findIndex(header => header === '비교_즉시구매가격');
        const urlIndex = headers.findIndex(header => header === '비교_제품_URL');
        const stockIndex = headers.findIndex(header => header === '비교_재고량');

        // 디버깅용 로그 추가
        // console.log('Headers:', headers);
        // console.log('Column Indices:', {
        //     productId: productIdIndex,
        //     baseOption: baseOptionIndex,
        //     compareOption1: compareOption1Index,
        //     compareOption2: compareOption2Index,
        //     marketType: marketTypeIndex,
        //     imageUrl: imageUrlIndex,
        //     price: priceIndex,
        //     url: urlIndex,
        //     stock: stockIndex
        // });
        // console.log('Sample Row:', rows[0]);
        // console.log('Image URL from sample:', rows[0]?.[imageUrlIndex]);

        // 품번으로 필터링
        const filteredRows = rows.filter(row => {
            if (!row[productIdIndex]) return false;
            const productId = row[productIdIndex].toString().toLowerCase();
            return productId.includes(query.toLowerCase());
        });

        // 품번 -> 옵션 -> 마켓 순으로 그룹핑
        const groupedByProductId = filteredRows.reduce((acc, row) => {
            const productId = row[productIdIndex];
            const optionSize = row[baseOptionIndex] || '기본';  // 기준_옵션_1로 그룹핑
            const marketType = row[marketTypeIndex] || '기타';
            
            if (!acc[productId]) {
                acc[productId] = {
                    productId,
                    productName: row[0] || '',
                    options: {}
                };
            }

            if (!acc[productId].options[optionSize]) {
                acc[productId].options[optionSize] = {
                    markets: {}
                };
            }

            acc[productId].options[optionSize].markets[marketType] = {
                siteName: row[5] || '',
                price: parseInt(row[priceIndex]) || 0,
                imageUrl: getValidImageUrl(row[imageUrlIndex]),
                url: row[urlIndex] || '',
                stock: parseInt(row[stockIndex]) || 0,
                compareOption1: row[compareOption1Index] || '',  // 비교_옵션_1
                compareOption2: row[compareOption2Index] || ''   // 비교_옵션_2
            };

            return acc;
        }, {} as Record<string, GroupedResult>);

        return Object.values(groupedByProductId);

    } catch (error: unknown) {
        console.error('Search error:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                url: SHEETS_API_URL
            });
        }
        return [];
    }
} 