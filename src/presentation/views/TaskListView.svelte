<script lang="ts">
	import { onMount } from 'svelte';
	import { TaskListViewModel } from '../viewmodels/TaskListViewModel';
	import TaskItem from '../components/TaskItem.svelte';
	import type { Task } from '../../core/models/Task';

	const vm = new TaskListViewModel();

	let tasks: Task[] = [];
	let loading = false;
	let error: string | null = null;

	const unsubscribeTasks = vm.tasks.subscribe((v) => (tasks = v));
	const unsubscribeLoading = vm.loading.subscribe((v) => (loading = v));
	const unsubscribeError = vm.error.subscribe((v) => (error = v));

	onMount(() => {
		vm.loadTasks();
		return () => {
			unsubscribeTasks();
			unsubscribeLoading();
			unsubscribeError();
		};
	});
</script>

{#if loading}
	<p>Loading tasks...</p>
{:else if error}
	<p class="text-red-500">{error}</p>
{:else if tasks.length === 0}
	<p>No tasks found.</p>
{:else}
	<ul>
		{#each tasks as task}
			<TaskItem {task} />
		{/each}
	</ul>
{/if}
