<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronDown } from '@lucide/svelte';
	import type { Component, Snippet } from 'svelte';

	const {
		title,
		subtitle,
		icon = null,
		accent = 'from-sky-500/30 via-sky-400/20 to-blue-500/10',
		divider = true,
		defaultOpen = true,
		children
	}: {
		title: string;
		subtitle?: string;
		icon?: Component | null;
		accent?: string;
		divider?: boolean;
		defaultOpen?: boolean;
		children?: Snippet;
	} = $props();

	let open = $state(defaultOpen);
</script>

<div
	class="overflow-hidden rounded-2xl border border-white/5 bg-card/60 shadow-2xl shadow-slate-950/50"
>
	<button
		type="button"
		class="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/5"
		onclick={() => (open = !open)}
	>
		<div
			class={cn(
				'relative flex size-12 items-center justify-center overflow-hidden rounded-2xl text-sky-100',
				'bg-gradient-to-br shadow-lg ring-1 shadow-sky-900/40 ring-white/10',
				accent
			)}
		>
			{#if icon}
				{@const Icon = icon}
				<Icon class="size-5" />
			{/if}
			<span
				class="pointer-events-none absolute inset-x-4 bottom-1 h-8 rounded-full bg-white/10 blur-lg"
			></span>
		</div>
		<div class="flex-1">
			<p class="text-base font-semibold text-white">{title}</p>
			{#if subtitle}
				<p class="text-sm text-muted-foreground">{subtitle}</p>
			{/if}
		</div>
		<ChevronDown
			class={cn(
				'size-5 text-muted-foreground transition-transform duration-200',
				open ? 'rotate-180' : ''
			)}
		/>
	</button>
	{#if divider}
		<div class="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
	{/if}
	{#if open}
		<div class="px-5 pt-4 pb-6">
			{@render children?.()}
		</div>
	{/if}
</div>
