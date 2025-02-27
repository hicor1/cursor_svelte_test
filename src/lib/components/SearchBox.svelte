<script lang="ts">
    import { goto } from '$app/navigation';
    import { searchResults } from '$lib/stores/search';
    import { onMount } from 'svelte';
    import Portal from '$lib/components/Portal.svelte';

    export let searchQuery = '';
    export let recentSearches: string[] = [];
    
    let searching = false;
    let searchInputFocused = false;
    let showSearchHistory = false;
    let searchBoxElement: HTMLElement;
    let dropdownPosition = { top: 0, left: 0, width: 0 };

    onMount(() => {
        // 검색 영역 외부 클릭 이벤트 처리
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxElement && !searchBoxElement.contains(event.target as Node)) {
                showSearchHistory = false;
                searchInputFocused = false;
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });

    async function handleSearch() {
        if (searchQuery.length < 2) {
            alert('검색어는 2글자 이상 입력해야 합니다.');
            return;
        }

        searching = true;
        try {
            await searchResults.search(searchQuery);
            goto(`/resell-search?q=${encodeURIComponent(searchQuery)}`);
        } catch (error) {
            console.error('Search error:', error);
            alert('검색 중 오류가 발생했습니다.');
        } finally {
            searching = false;
        }
    }

    function handleSearchFocus() {
        searchInputFocused = true;
        showSearchHistory = recentSearches.length > 0;
        
        // 드롭다운 위치 계산
        updateDropdownPosition();
    }

    function updateDropdownPosition() {
        // setTimeout을 사용하여 DOM 업데이트 후 위치 계산
        setTimeout(() => {
            if (searchBoxElement) {
                const rect = searchBoxElement.getBoundingClientRect();
                dropdownPosition = {
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                };
            }
        }, 0);
    }

    function handleSearchBlur() {
        // 클릭 이벤트가 완전히 처리될 수 있도록 타임아웃 증가
        setTimeout(() => {
            // 클릭 이벤트 리스너로 처리하므로 여기서는 제거
        }, 300);
    }

    function handleHistoryItemClick(search: string) {
        searchQuery = search;
        handleSearch();
    }
    
    // 창 크기 변경 시 드롭다운 위치 업데이트
    function handleResize() {
        if (showSearchHistory) {
            updateDropdownPosition();
        }
    }
</script>

<svelte:window on:resize={handleResize} />

<div class="search-box" bind:this={searchBoxElement}>
    <div class="search-input-wrapper">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z" fill="currentColor"/>
        </svg>
        <input 
            type="text" 
            bind:value={searchQuery}
            placeholder="품번 또는 제품명을 입력하세요 (예: B75806, Samba OG)"
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
            on:focus={handleSearchFocus}
            on:blur={handleSearchBlur}
        />
        <button on:click={handleSearch} disabled={searching}>
            {#if searching}
                <div class="loading-spinner"></div>
            {:else}
                검색
            {/if}
        </button>
    </div>
    
    <!-- 포털을 사용하여 드롭다운을 body에 직접 렌더링 -->
    {#if showSearchHistory && recentSearches.length > 0}
        <Portal>
            <div 
                class="search-history-dropdown" 
                class:show={searchInputFocused}
                style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; width: {dropdownPosition.width}px;"
            >
                {#each recentSearches as search}
                    <div class="history-item">
                        <div 
                            class="history-text"
                            on:mousedown={() => handleHistoryItemClick(search)}
                        >
                            <svg class="history-icon" width="14" height="14" viewBox="0 0 24 24">
                                <path d="M12.25 2c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.5 17.135 2.5 11.75 6.865 2 12.25 2zM12.25 4.5c-4.005 0-7.25 3.245-7.25 7.25s3.245 7.25 7.25 7.25 7.25-3.245 7.25-7.25-3.245-7.25-7.25-7.25zm.75 3.25v4.5l3.5 2-0.75 1.25L11.5 13V7.75h1.5z" fill="currentColor"/>
                            </svg>
                            <span>{search}</span>
                        </div>
                    </div>
                {/each}
            </div>
        </Portal>
    {/if}
</div>

<style>
    .search-box {
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        padding: 0 20px;
        position: relative;
        z-index: 1000; /* 다른 요소보다 위에 표시 */
    }

    .search-input-wrapper {
        width: 100%;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .search-icon {
        position: absolute;
        left: 12px;
        top: 24px;
        transform: translateY(-50%);
        color: #666;
    }

    input {
        flex: 1;
        min-width: 200px;
        padding: 12px 12px 12px 40px;
        border: 1px solid #ddd;
        border-radius: 8px 0 0 8px;
        font-size: 16px;
        border-right: none;
    }

    button {
        padding: 12px 24px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 0 8px 8px 0;
        cursor: pointer;
        white-space: nowrap;
        min-width: 80px;
    }

    button:hover {
        background: #ff5252;
    }

    .search-history-dropdown {
        position: absolute; /* Portal 내에서는 absolute 사용 */
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        margin-top: 5px;
        z-index: 999999 !important; /* 최상위 z-index */
        display: none;
        animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .search-history-dropdown.show {
        display: block;
    }

    .history-item {
        padding: 8px 12px;
        cursor: pointer;
    }

    .history-item:hover {
        background: #f5f5f5;
    }

    .history-text {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @media (max-width: 480px) {
        .search-box {
            padding: 0 10px;
        }

        .search-input-wrapper {
            flex-direction: column;
            gap: 8px;
            padding: 8px;
        }

        input {
            width: 100%;
            border-radius: 8px;
            border-right: 1px solid #ddd;
        }

        button {
            width: 100%;
            border-radius: 8px;
        }

        .search-icon {
            top: 28px;
        }
    }
</style> 