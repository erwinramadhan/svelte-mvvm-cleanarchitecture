<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import type { Snippet } from 'svelte';

	export let label: string;
	export let description = '';
	export let required = false;
	export let id = crypto.randomUUID();
	export let children: Snippet<[props: { id: string }]> | null = null;
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between gap-2">
		<Label for={id} class="flex items-center gap-1.5 text-slate-100">
			<span>{label}</span>
			{#if required}
				<span class="text-rose-400">*</span>
			{/if}
		</Label>
		{#if description}
			<span class="text-xs text-muted-foreground">{description}</span>
		{/if}
	</div>
	<div class="space-y-2">
		{@render children?.({ id })}
	</div>
</div>
