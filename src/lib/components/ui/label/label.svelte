<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	export type LabelProps = WithElementRef<HTMLLabelAttributes>;
</script>

<script lang="ts">
	let { class: className, ref = $bindable(null), children, ...restProps }: LabelProps = $props();
</script>

<label
	bind:this={ref}
	class={cn(
		'text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</label>
