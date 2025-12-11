<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type InputProps = WithElementRef<HTMLInputAttributes>;
</script>

<script lang="ts">
	let {
		class: className,
		value = undefined,
		ref = $bindable(null),
		...restProps
	}: InputProps = $props();
</script>

<input
	bind:this={ref}
	class={cn(
		'flex h-11 w-full rounded-lg border border-input/60 bg-background/70 px-3 py-2 text-sm text-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.08)] transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{value}
	{...restProps}
/>
