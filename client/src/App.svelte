<script>
	import Axios from "axios";
	import Transaction from "./components/Transaction.svelte";
	import SummaryCard from "./components/SummaryCard.svelte";
	import Loading from "./components/Loading.svelte";
	import { onMount } from "svelte";
	import {
		transactions,
		sortedTransactions,
		income,
		expenses,
		balance,
	} from "./stores";

	let input = 0;
	let typeOfTransaction = "income";
	let loading = false;

	$: disabled = !input;

	onMount(async () => {
		loading = true;
		const { data } = await Axios.get("api/transactions");
		$transactions = data;
		loading = false;
	});

	async function addTransaction() {
		const transaction = {
			date: new Date().getTime(),
			value: typeOfTransaction === "income" ? input : input * -1,
		};
		const response = await Axios.post("/api/transactions", transaction);
		$transactions = [response.data, ...$transactions];
		input = 0;
	}

	async function removeTransaction(id) {
		const response = await Axios.delete("/api/transactions/" + id);
		if (response.data.id === id) {
			$transactions = $transactions.filter((t) => t._id !== id);
		}
	}
</script>

<style>
	.app {
		margin: 40px auto;
		max-width: 500px !important;
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
	{#if loading}
		<Loading />
	{/if}
	{#if $transactions.length > 0}
		<SummaryCard mode="balance" value={$balance} />

		<div class="columns">
			<div class="column">
				<SummaryCard mode="income" value={$income} />
			</div>
			<div class="column">
				<SummaryCard mode="expenses" value={$expenses} />
			</div>
		</div>

		<hr />
	{:else if !loading}
		<div class="notification">Add your income or expenses above</div>
	{/if}

	{#each $sortedTransactions as transaction (transaction._id)}
		<Transaction {transaction} {removeTransaction} />
	{/each}
</div>
