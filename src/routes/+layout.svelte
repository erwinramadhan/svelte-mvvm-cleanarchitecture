<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { setUnauthorizedHandler } from '$lib/api/axios-instance';
	import { authStore, createAuthSessionViewModel } from '$application/container';

	let { children } = $props();
	let isInitializing = $state(true);
	let unsubscribers: Array<() => void> = [];
	const sessionViewModel = createAuthSessionViewModel();
	const auth = authStore;

	const isAuthRoute = (pathname: string) =>
		pathname.startsWith('/login') || pathname.startsWith('/register');

	const isProtectedRoute = (pathname: string) =>
		!pathname.startsWith('/login') &&
		!pathname.startsWith('/register') &&
		!pathname.startsWith('/reset-password') &&
		!pathname.startsWith('/forgot-password');

	onMount(async () => {
		const unauthorizedCleanup = setUnauthorizedHandler(() => {
			auth.reset();
			if (typeof window !== 'undefined') {
				const path = window.location.pathname;
				if (isProtectedRoute(path)) {
					goto('/login');
				}
			}
		});

		const initResult = await sessionViewModel.initialize();
		const path = typeof window !== 'undefined' ? window.location.pathname : '/';
		if (!initResult.authenticated && isProtectedRoute(path)) {
			goto('/login');
		} else if (initResult.authenticated && isAuthRoute(path)) {
			goto('/');
		}

		unsubscribers = [unauthorizedCleanup];
		isInitializing = false;
	});

	onDestroy(() => {
		unsubscribers.forEach((unsubscribe) => unsubscribe());
		unsubscribers = [];
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isInitializing}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="text-center">
			<div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
			<p class="mt-4 text-gray-700">Initializing authentication...</p>
		</div>
	</div>
{:else}
	{@render children?.()}
{/if}
