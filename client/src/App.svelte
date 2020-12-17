<script>
	import Axios from "axios";
	import { onMount } from "svelte";
	import { each } from "svelte/internal";

	let input = 0;
	let typeOfTransaction = "income";
	let transactions = [];

	onMount(async () => {
		const { data } = await Axios.get("api/transactions");
		transactions = data;
	});

	async function addTransaction() {
		const transaction = {
			date: new Date().getTime(),
			value: typeOfTransaction === "income" ? input : input * -1,
		};
		const response = await Axios.post("/api/transactions", transaction);
		transactions = [response.data, ...transactions];
		input = 0;
	}

	async function removeTransaction(id) {
		const response = await Axios.delete("/api/transactions/" + id);
		if (response.data.id === id) {
			transactions = transactions.filter((t) => t._id !== id);
		}
	}
</script>

<style>
	.app {
		margin: 40px auto;
		max-width: 500px;
	}
</style>

<div class="app container">
	<div class="field has-addons">
		<p class="control">
			<span class="select">
				<select bind:value={typeOfTransaction}>
					<option value="income">Income</option>
					<option value="expense">Expense</option>
				</select>
			</span>
		</p>
		<p class="control is-expanded">
			<input
				class="input"
				type="number"
				bind:value={input}
				placeholder="Amount of money" />
		</p>
		<p class="control">
			<button class="button" on:click={addTransaction}> Save </button>
		</p>
	</div>
	<hr />
	{#each transactions as transaction (transaction._id)}
		<div
			class="notification {transaction.value > 0 ? 'is-success' : 'is-danger'}">
			{transaction.value}
			<button
				class="delete"
				on:click={() => removeTransaction(transaction._id)} />
		</div>
	{/each}
</div>
