import { searchCache } from './cache';

// 1시간마다 캐시 정리
setInterval(() => {
    searchCache.cleanup();
}, 1000 * 60 * 60); 