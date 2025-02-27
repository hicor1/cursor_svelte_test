<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  // 포털 대상 요소 (기본값은 document.body)
  export let target: HTMLElement = document.body;
  
  let portal: HTMLElement;
  
  onMount(() => {
    // 컴포넌트가 마운트될 때 대상 요소에 포털 추가
    target.appendChild(portal);
    
    return () => {
      // 컴포넌트가 언마운트될 때 포털 제거
      target.removeChild(portal);
    };
  });
</script>

<div bind:this={portal} class="portal">
  <slot></slot>
</div>

<style>
  .portal {
    /* 이 요소는 단순히 내용을 전달하는 컨테이너이므로 스타일 최소화 */
    position: static;
    z-index: 999999;
  }
</style> 