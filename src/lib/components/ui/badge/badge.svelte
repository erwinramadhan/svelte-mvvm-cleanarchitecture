<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type BadgeProps = WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
		variant?: 'default' | 'success' | 'outline' | 'muted';
	};
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'default',
		ref = $bindable(null),
		children,
		...restProps
	}: BadgeProps = $props();

	const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
		default: 'bg-primary/10 text-primary border border-primary/30',
		success: 'bg-emerald-500/15 text-emerald-100 border border-emerald-500/40',
		outline: 'border border-border/60 text-foreground/80',
		muted: 'bg-muted/30 text-muted-foreground border border-white/5'
	};
</script>

<span
	bind:this={ref}
	class={cn(
		'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase',
		variants[variant],
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
