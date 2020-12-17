<script>
	import Axios from "axios";
	import Transaction from "./components/Transaction.svelte";
	import SummaryCard from "./components/SummaryCard.svelte";
	import { onMount } from "svelte";

	let input = 0;
	let typeOfTransaction = "income";
	let transactions = [];

	$: disabled = !input;
	$: balance = transactions.reduce((acc, t) => acc + t.value, 0);
	$: income = transactions
		.filter((t) => t.value > 0)
		.reduce((acc, t) => acc + t.value, 0);

	$: expenses = transactions
		.filter((t) => t.value < 0)
		.reduce((acc, t) => acc + t.value, 0);

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
			<button class="button" on:click={addTransaction} {disabled}>
				Save
			</button>
		</p>
	</div>

	<SummaryCard mode="balance" value={balance} />

	<div class="columns">
		<div class="column">
			<SummaryCard mode="income" value={income} />
		</div>
		<div class="column">
			<SummaryCard mode="expenses" value={expenses} />
		</div>
	</div>

	<hr />
	{#each transactions as transaction (transaction._id)}
		<Transaction {transaction} {removeTransaction} />
	{/each}
</div>
