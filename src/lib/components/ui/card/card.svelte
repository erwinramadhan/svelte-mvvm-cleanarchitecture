<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type CardProps = WithElementRef<HTMLAttributes<HTMLDivElement>>;
</script>

<script lang="ts">
	let { class: className, ref = $bindable(null), children, ...restProps }: CardProps = $props();
</script>

<div
	bind:this={ref}
	class={cn(
		'rounded-2xl border border-white/5 bg-card/70 text-card-foreground shadow-xl shadow-slate-950/40 backdrop-blur',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
