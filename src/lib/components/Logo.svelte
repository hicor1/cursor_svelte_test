<script lang="ts">
    export let size = 32;
</script>

<div class="logo" style="--size: {size}px">
    <div class="orbit">
        <div class="planet"></div>
    </div>
    <span class="text">RESELLA</span>
</div>

<style>
    .logo {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .orbit {
        width: var(--size);
        height: var(--size);
        border: 2px solid #6366f1;
        border-radius: 50%;
        position: relative;
        animation: rotate 8s linear infinite;
    }

    .planet {
        width: calc(var(--size) * 0.3);
        height: calc(var(--size) * 0.3);
        background: #6366f1;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: calc(var(--size) * 0.1);
        transform: translateY(-50%);
    }

    .text {
        font-size: calc(var(--size) * 0.8);
        font-weight: bold;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        -webkit-background-clip: text;
        color: transparent;
    }

    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style> 