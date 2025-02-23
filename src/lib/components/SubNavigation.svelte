<script lang="ts">
	export let items: {
		id: string;
		name: string;
		active: boolean;
	}[] = [];
</script>

<div class="sub-navigation">
	<ul>
		{#each items as item}
			<li class:active={item.active}>
				<a href="/shopping-info/{item.id}">{item.name}</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.sub-navigation {
		margin: 20px 0 40px;
		border-bottom: 1px solid #eee;
	}

	.sub-navigation ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		gap: 30px;
	}

	.sub-navigation li {
		position: relative;
		padding: 10px 0;
	}

	.sub-navigation li.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: #ff6b6b;
	}

	.sub-navigation a {
		color: #666;
		text-decoration: none;
		font-size: 15px;
		font-weight: 500;
	}

	.sub-navigation li.active a {
		color: #ff6b6b;
	}
</style> 