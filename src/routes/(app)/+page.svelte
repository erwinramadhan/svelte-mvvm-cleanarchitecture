<script>
	import TaskListView from '$presentation/views/TaskListView.svelte';
</script>

<section class="mx-auto max-w-3xl space-y-6 py-10">
	<header class="space-y-2">
		<h1 class="text-3xl font-semibold text-gray-900">Task board</h1>
		<p class="text-gray-600">Contoh implementasi MVVM + Clean Architecture pada Svelte.</p>
	</header>

	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<TaskListView />
	</div>
</section>
