<script lang="ts">
	export let notices: {
		type: string;
		category: string;
		title: string;
		author: string;
		date: string;
		likes: number;
	}[] = [];
</script>

<div class="notice-section">
	<table class="notice-table">
		<tbody>
			{#each notices as notice}
				<tr>
					<td class="notice-type">{notice.type}</td>
					<td class="notice-category">{notice.category}</td>
					<td class="notice-title">{notice.title}</td>
					<td class="notice-author">{notice.author}</td>
					<td class="notice-date">{notice.date}</td>
					<td class="notice-likes">♥ {notice.likes}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.notice-section {
		margin: 40px 0;
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
		padding: 20px;
	}

	.notice-table {
		width: 100%;
		border-collapse: collapse;
	}

	.notice-table tr {
		border-bottom: 1px solid #eee;
	}

	.notice-table tr:hover {
		background: #f8f9fa;
	}

	.notice-table td {
		padding: 15px 8px;
		font-size: 14px;
	}

	.notice-type {
		color: #ff6b6b;
		font-weight: bold;
		width: 60px;
	}

	.notice-category {
		color: #666;
		width: 80px;
	}

	.notice-title {
		font-weight: 500;
		color: #333;
	}

	.notice-title:hover {
		color: #ff6b6b;
		cursor: pointer;
	}

	.notice-author {
		color: #666;
		width: 100px;
	}

	.notice-date {
		color: #666;
		width: 100px;
	}

	.notice-likes {
		color: #666;
		width: 60px;
		text-align: right;
	}
</style> 