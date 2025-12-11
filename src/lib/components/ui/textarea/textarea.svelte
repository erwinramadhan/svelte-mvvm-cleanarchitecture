<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	export type TextareaProps = WithElementRef<HTMLTextareaAttributes>;
</script>

<script lang="ts">
	let { class: className, ref = $bindable(null), ...restProps }: TextareaProps = $props();
</script>

<textarea
	bind:this={ref}
	class={cn(
		'min-h-[120px] w-full rounded-lg border border-input/60 bg-background/70 px-3 py-3 text-sm text-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.08)] transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...restProps}
></textarea>
