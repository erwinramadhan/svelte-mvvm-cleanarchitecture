<script lang="ts">
	import { onMount } from 'svelte';
	import { createTaskListViewModel } from '$application/container';
	import TaskItem from '../components/TaskItem.svelte';

	const viewModel = createTaskListViewModel();
	const tasks = viewModel.tasks;
	const loading = viewModel.loading;
	const error = viewModel.error;

	onMount(() => {
		viewModel.loadTasks();
	});
</script>

{#if $loading}
	<p>Loading tasks...</p>
{:else if $error}
	<p class="text-red-500">{$error}</p>
{:else if $tasks.length === 0}
	<p>No tasks found.</p>
{:else}
	<ul>
		{#each $tasks as task (task.id)}
			<TaskItem {task} />
		{/each}
	</ul>
{/if}
