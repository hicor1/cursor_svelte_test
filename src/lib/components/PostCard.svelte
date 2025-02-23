<script lang="ts">
	export let post: {
		type: string;
		category: string;
		title: string;
		date: string;
		views: number;
		likes: number;
		comments: number;
		thumbnail?: string;
		author: {
			name: string;
			image?: string;
		};
	};
</script>

<div class="post-card">
	{#if post.thumbnail}
		<div class="thumbnail">
			<img src={post.thumbnail} alt={post.title} />
		</div>
	{/if}
	<div class="post-content">
		<div class="post-header">
			<span class="post-type">{post.type}</span>
			<span class="post-category">{post.category}</span>
			<h3 class="post-title">{post.title}</h3>
		</div>
		<div class="post-footer">
			<div class="post-meta">
				<span class="author">{post.author.name}</span>
				<span class="date">{post.date}</span>
			</div>
			<div class="post-stats">
				<span>❤️ {post.likes}</span>
				<span>💬 {post.comments}</span>
				<span>👁️ {post.views}</span>
			</div>
		</div>
	</div>
</div>

<style>
	.post-card {
		border: 1px solid #eee;
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.post-card:hover {
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}

	.thumbnail {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.post-content {
		padding: 15px;
	}

	.post-header {
		margin-bottom: 10px;
	}

	.post-type {
		background: #ff6b6b;
		color: white;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 12px;
		margin-right: 8px;
	}

	.post-category {
		color: #666;
		font-size: 14px;
	}

	.post-title {
		margin: 8px 0;
		font-size: 16px;
		line-height: 1.4;
	}

	.post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		color: #666;
	}

	.post-meta {
		display: flex;
		gap: 10px;
	}

	.post-stats {
		display: flex;
		gap: 15px;
	}
</style> 