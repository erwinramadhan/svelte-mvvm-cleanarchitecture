<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { afterNavigate, goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { authStore, createAuthSessionViewModel } from '$application/container';
	import type { AuthState } from '$presentation/stores/authStore';

	let { children } = $props();
	let isInitializing = $state(true);
	let currentPath = '';
	let authState: AuthState = get(authStore);
	let unsubscribers: Array<() => void> = [];
	const sessionViewModel = createAuthSessionViewModel();
	const auth = authStore;

	const isAuthRoute = (pathname: string) =>
		pathname.startsWith('/login') || pathname.startsWith('/register');

	const isProtectedRoute = (pathname: string) =>
		!isAuthRoute(pathname) &&
		!pathname.startsWith('/reset-password') &&
		!pathname.startsWith('/forgot-password');

	const enforceGuard = (state: AuthState, pathname: string) => {
		if (isProtectedRoute(pathname) && !state.isAuthenticated) {
			goto('/login');
			return;
		}

		if (isAuthRoute(pathname) && state.isAuthenticated) {
			goto('/');
		}
	};

	onMount(async () => {
		// Observe navigation changes to re-run guard after every route change
		afterNavigate(({ to }) => {
			if (!to) return;
			currentPath = to.url.pathname;
			if (!isInitializing) {
				enforceGuard(authState, currentPath);
			}
		});

		await sessionViewModel.initialize();
		isInitializing = false;

		authState = get(auth);
		currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
		enforceGuard(authState, currentPath);

		const authUnsub = auth.subscribe((state) => {
			authState = state;
			if (!isInitializing) {
				enforceGuard(state, currentPath);
			}
		});

		unsubscribers = [authUnsub];
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
