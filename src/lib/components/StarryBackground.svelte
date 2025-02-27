<script lang="ts">
    const stars = Array(200).fill(null).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1 + 0.1,
        opacity: Math.random(),
        speed: Math.random() * 3 + 1,
        moveSpeed: Math.random() * 50 + 30
    }));
</script>

<div class="stars-container">
    {#each stars as star}
        <div 
            class="star"
            style="
                left: {star.x}%;
                top: {star.y}%;
                width: {star.size}px;
                height: {star.size}px;
                opacity: {star.opacity};
                animation: 
                    twinkle {star.speed}s infinite ease-in-out,
                    float {star.moveSpeed}s infinite linear;
                --move-duration: {star.moveSpeed}s;
            "
        ></div>
    {/each}
</div>

<style>
    .stars-container {
        position: absolute;
        top: -50px;
        left: 0;
        width: 100%;
        height: calc(100% + 100px);
        z-index: 1;
    }

    .star {
        position: absolute;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        animation: float var(--move-duration) infinite linear;
    }

    @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }

    @keyframes float {
        from { transform: translateY(0); }
        to { transform: translateY(-100px); }
    }
</style> 