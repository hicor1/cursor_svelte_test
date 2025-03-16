<script lang="ts">
	interface SizeRow {
		[key: string]: string;
		kr: string;
		usm: string;
		usw: string;
		uk: string;
		jp: string;
		eu: string;
	}

	interface ProductInfo {
		id: string;
		name: string;
		image: string;
		brand: string;
		prices: {
			platform: string;
			price: number;
			url: string;
		}[];
		sizeTable: SizeRow[];
	}

	// 샘플 데이터 (실제로는 DB에서 가져옵니다)
	const sampleProducts: Record<string, ProductInfo> = {
		'DD1391-100': {
			id: 'DD1391-100',
			name: 'Nike Dunk Low Retro White Black Panda',
			image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/0e7fc8f3-76b7-4631-b147-4dad4b1ff241/dunk-low-retro-mens-shoes-87q0hf.png',
			brand: 'Nike',
			prices: [
				{
					platform: 'KREAM',
					price: 139000,
					url: 'https://kream.co.kr/products/1234'
				},
				{
					platform: '무신사',
					price: 142000,
					url: 'https://store.musinsa.com/products/1234'
				},
				{
					platform: 'NIKE',
					price: 129000,
					url: 'https://nike.com/kr/products/1234'
				}
			],
			sizeTable: [
				{ kr: '225', usm: '3.5', usw: '5', uk: '3', jp: '22.5', eu: '35.5' },
				{ kr: '230', usm: '4', usw: '5.5', uk: '3.5', jp: '23', eu: '36' },
				{ kr: '235', usm: '4.5', usw: '6', uk: '4', jp: '23.5', eu: '36.5' },
				{ kr: '235', usm: '5', usw: '6.5', uk: '4.5', jp: '23.5', eu: '37.5' },
				{ kr: '240', usm: '5.5', usw: '7', uk: '5', jp: '24', eu: '38' },
				{ kr: '240', usm: '6', usw: '7.5', uk: '5.5', jp: '24', eu: '38.5' },
				{ kr: '245', usm: '6.5', usw: '8', uk: '6', jp: '24.5', eu: '39' },
				{ kr: '250', usm: '7', usw: '8.5', uk: '6', jp: '25', eu: '40' },
				{ kr: '255', usm: '7.5', usw: '9', uk: '6.5', jp: '25.5', eu: '40.5' },
				{ kr: '260', usm: '8', usw: '9.5', uk: '7', jp: '26', eu: '41' },
				{ kr: '265', usm: '8.5', usw: '10', uk: '7.5', jp: '26.5', eu: '42' },
				{ kr: '270', usm: '9', usw: '10.5', uk: '8', jp: '27', eu: '42.5' },
				{ kr: '275', usm: '9.5', usw: '11', uk: '8.5', jp: '27.5', eu: '43' },
				{ kr: '280', usm: '10', usw: '11.5', uk: '9', jp: '28', eu: '44' }
			]
		}
	};

	let productId = '';
	let error = '';
	let currentProduct: ProductInfo | null = null;

	const unitLabels = {
		kr: 'KR',
		usm: 'US (남성)',
		usw: 'US (여성)',
		uk: 'UK',
		jp: 'JP',
		eu: 'EU'
	};

	function searchProduct() {
		if (!productId) {
			error = '품번을 입력해주세요.';
			currentProduct = null;
			return;
		}

		// 실제로는 여기서 DB에서 상품 정보를 가져옵니다
		const product = sampleProducts[productId];
		
		if (!product) {
			error = '해당 품번의 상품을 찾을 수 없습니다.';
			currentProduct = null;
			return;
		}

		error = '';
		currentProduct = product;
	}
</script>

<div class="container">
	<h2>사이즈 변환</h2>
	
	<div class="converter">
		<div class="input-group">
			<label for="productId">제품 품번</label>
			<div class="search-group">
				<input
					id="productId"
					type="text"
					bind:value={productId}
					placeholder="예) DD1391-100"
					on:keydown={(e) => e.key === 'Enter' && searchProduct()}
				/>
				<button on:click={searchProduct} class="search-button">검색</button>
			</div>
		</div>

		{#if currentProduct}
			<div class="product-basic-info">
				<div class="product-image">
					<img src={currentProduct.image} alt={currentProduct.name} />
				</div>
				<div class="product-main-details">
					<h3>{currentProduct.name}</h3>
					<p class="brand">{currentProduct.brand}</p>
					<p class="product-id">제품 품번: {currentProduct.id}</p>
				</div>
			</div>

			<div class="size-table">
				<h4>사이즈 변환표</h4>
				<div class="table-container">
					<table>
						<thead>
							<tr>
								{#each Object.entries(unitLabels) as [unit, label]}
									<th>{label}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each currentProduct.sizeTable as row}
								<tr>
									{#each Object.entries(unitLabels) as [unit]}
										<td>{row[unit]}</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<div class="market-prices">
				<h4>판매처별 가격</h4>
				<div class="price-list">
					{#each currentProduct.prices as price}
						<a href={price.url} target="_blank" rel="noopener noreferrer" class="price-item">
							<span class="platform">{price.platform}</span>
							<span class="price">{price.price.toLocaleString()}원</span>
							<span class="link-icon">→</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		{#if error}
			<p class="error-message">{error}</p>
		{/if}
	</div>

	<div class="size-info">
		<p class="info-text">
			※ 해당 사이즈 정보는 고객 이해를 위한 참고용이며, 브랜드나 또는 상품 카테고리마다 차이가 있을 수 있습니다. 
			정확한 내용은 실물 상품 기준으로 공식 제조사/유통사에 확인해 주시기 바랍니다.
		</p>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 40px auto;
		padding: 0 20px;
	}

	h2 {
		color: #333;
		margin-bottom: 30px;
	}

	.converter {
		background: white;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		margin-bottom: 20px;
	}

	.input-group {
		margin-bottom: 20px;
	}

	.search-group {
		display: flex;
		gap: 10px;
	}

	.search-button {
		padding: 12px 24px;
		background: #ff6b6b;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		transition: background 0.2s;
		white-space: nowrap;
	}

	.search-button:hover {
		background: #ff5252;
	}

	label {
		display: block;
		margin-bottom: 8px;
		color: #333;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-size: 16px;
		background: white;
	}

	input:focus {
		outline: none;
		border-color: #ff6b6b;
	}

	.product-basic-info {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 30px;
		margin-bottom: 30px;
		padding-bottom: 30px;
		border-bottom: 1px solid #eee;
	}

	.product-image {
		width: 200px;
		height: 200px;
		overflow: hidden;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.product-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 8px;
		transition: transform 0.3s ease;
	}

	.product-image:hover img {
		transform: scale(1.05);
	}

	.product-main-details h3 {
		margin: 0 0 10px;
		color: #333;
		font-size: 20px;
	}

	.brand {
		color: #666;
		margin: 0 0 10px;
	}

	.product-id {
		color: #666;
		font-size: 14px;
		margin: 0;
	}

	.size-table {
		margin-bottom: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid #eee;
	}

	.size-table h4 {
		margin: 0 0 10px;
		color: #333;
		font-size: 16px;
	}

	.market-prices {
		margin-bottom: 20px;
	}

	.market-prices h4 {
		margin: 0 0 15px;
		color: #333;
		font-size: 16px;
	}

	.price-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.price-item {
		display: flex;
		align-items: center;
		padding: 12px;
		background: #f8f9fa;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.price-item:hover {
		background: #ff6b6b15;
		transform: translateX(5px);
	}

	.platform {
		font-weight: 500;
		min-width: 80px;
	}

	.price {
		flex: 1;
		text-align: right;
		color: #ff6b6b;
		font-weight: 500;
	}

	.link-icon {
		margin-left: 10px;
		color: #999;
	}

	.error-message {
		color: #ff6b6b;
		margin: 10px 0;
		font-size: 14px;
	}

	.table-container {
		overflow-x: auto;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		transition: all 0.2s ease;
	}

	.table-container:hover {
		box-shadow: 0 8px 16px rgba(0,0,0,0.1);
		transform: translateY(-2px);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background: white;
	}

	th, td {
		padding: 8px 12px;
		text-align: center;
		border: 1px solid #eee;
		transition: all 0.2s ease;
	}

	th {
		background: #f8f9fa;
		font-weight: 500;
		color: #333;
	}

	td {
		color: #666;
		font-weight: 500;
	}

	tr:hover td {
		background: #ff6b6b15;
		color: #ff6b6b;
		transform: scale(1.02);
	}

	.size-info {
		background: white;
		padding: 20px;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
	}

	.info-text {
		color: #666;
		font-size: 14px;
		line-height: 1.6;
		margin: 0;
	}

	@media (max-width: 600px) {
		.product-basic-info {
			grid-template-columns: 1fr;
		}

		.product-image {
			max-width: 300px;
			margin: 0 auto;
		}

		.product-main-details {
			text-align: center;
		}

		.table-container {
			margin: 0 -20px;
			border-radius: 0;
		}

		table {
			font-size: 14px;
		}

		th, td {
			padding: 8px;
		}
	}
</style> 