import { MemoryCache } from './cache';

// 1시간마다 캐시 정리
setInterval(() => {
    MemoryCache.cleanup();
}, 1000 * 60 * 60); 