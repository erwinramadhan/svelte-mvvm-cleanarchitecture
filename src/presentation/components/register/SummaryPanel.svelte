<script lang="ts">
	import {
		Badge,
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui';
	import { ArrowRight, CheckCircle2, Circle } from '@lucide/svelte';

	export interface SummaryStep {
		title: string;
		description?: string;
		complete?: boolean;
	}

	const { steps = [] }: { steps: SummaryStep[] } = $props();
</script>

<Card class="border-white/10 bg-slate-900/70 backdrop-blur">
	<CardHeader class="space-y-3 border-b border-white/5">
		<Badge variant="muted">Ringkasan Pendaftaran</Badge>
		<div class="space-y-1">
			<CardTitle class="text-xl text-white">Status Formulir</CardTitle>
			<CardDescription>Pastikan seluruh bagian sudah terisi dan tervalidasi.</CardDescription>
		</div>
	</CardHeader>
	<CardContent class="space-y-3">
		{#each steps as step (step.title)}
			<div class="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-3">
				{#if step.complete}
					<CheckCircle2 class="mt-0.5 size-5 text-emerald-400" />
				{:else}
					<Circle class="mt-0.5 size-5 text-white/50" />
				{/if}
				<div class="flex-1 space-y-1">
					<p class="text-sm font-semibold text-white">{step.title}</p>
					{#if step.description}
						<p class="text-xs text-muted-foreground">{step.description}</p>
					{/if}
				</div>
				<ArrowRight class="mt-0.5 size-4 text-white/50" />
			</div>
		{/each}
	</CardContent>
</Card>
