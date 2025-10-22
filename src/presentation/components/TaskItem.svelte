<script lang="ts">
	import type { Task } from '../../core/models/Task';
	export let task: Task;
</script>

<li class="flex items-center gap-2">
	<input type="checkbox" bind:checked={task.completed} disabled />
	<span class:line-through={task.completed}>{task.title}</span>
</li>
