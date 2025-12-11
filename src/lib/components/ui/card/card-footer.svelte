<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type CardFooterProps = WithElementRef<HTMLAttributes<HTMLDivElement>>;
</script>

<script lang="ts">
	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: CardFooterProps = $props();
</script>

<div bind:this={ref} class={cn('flex items-center gap-3 px-6 pt-2 pb-6', className)} {...restProps}>
	{@render children?.()}
</div>
