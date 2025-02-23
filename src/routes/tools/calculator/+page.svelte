<script lang="ts">
	let purchasePrice = 0;
	let platformFee = 3; // 기본 수수료율
	let shippingCost = 3000;
	let targetProfit = 30000;

	// 플랫폼 선택 옵션
	const platforms = [
		{ name: 'KREAM', fee: 3 },
		{ name: 'SOLDOUT', fee: 2.5 },
		{ name: 'XXBLUE', fee: 4 },
		{ name: 'CREAM', fee: 3.5 }
	];

	$: recommendedPrice = Math.ceil(
		(purchasePrice + shippingCost + targetProfit) / (1 - platformFee/100)
	);

	$: actualProfit = Math.floor(
		recommendedPrice * (1 - platformFee/100) - purchasePrice - shippingCost
	);
</script>

<div class="calculator-container">
	<h2>리셀 마진 계산기</h2>
	
	<div class="calc-form">
		<div class="input-group">
			<label for="purchase">구매가</label>
			<input 
				type="number" 
				id="purchase"
				bind:value={purchasePrice}
				placeholder="상품 구매가"
			/>
		</div>

		<div class="input-group">
			<label for="platform">판매 플랫폼</label>
			<select bind:value={platformFee}>
				{#each platforms as platform}
					<option value={platform.fee}>{platform.name} ({platform.fee}%)</option>
				{/each}
			</select>
		</div>

		<div class="input-group">
			<label for="shipping">배송비</label>
			<input 
				type="number" 
				id="shipping"
				bind:value={shippingCost}
				placeholder="배송비"
			/>
		</div>

		<div class="input-group">
			<label for="target">목표 순수익</label>
			<input 
				type="number" 
				id="target"
				bind:value={targetProfit}
				placeholder="목표 순수익"
			/>
		</div>
	</div>

	<div class="results">
		<div class="result-item">
			<h3>추천 판매가</h3>
			<p class="price">{recommendedPrice.toLocaleString()}원</p>
		</div>
		<div class="result-item">
			<h3>예상 순수익</h3>
			<p class="profit">{actualProfit.toLocaleString()}원</p>
		</div>
	</div>
</div>

<style>
	.calculator-container {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	h2 {
		color: #333;
		margin-bottom: 30px;
		text-align: center;
	}

	.calc-form {
		display: grid;
		gap: 20px;
		margin-bottom: 30px;
	}

	.input-group {
		display: grid;
		gap: 8px;
	}

	label {
		font-size: 14px;
		color: #666;
	}

	input, select {
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 16px;
	}

	.results {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		padding: 20px;
		background: #f8f9fa;
		border-radius: 4px;
	}

	.result-item {
		text-align: center;
	}

	.result-item h3 {
		font-size: 14px;
		color: #666;
		margin-bottom: 8px;
	}

	.price {
		color: #ff6b6b;
		font-size: 24px;
		font-weight: bold;
	}

	.profit {
		color: #40c057;
		font-size: 24px;
		font-weight: bold;
	}
</style> 