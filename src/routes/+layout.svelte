<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authStore } from '../application/stores/authStore';
	import { AuthService } from '../lib/services/AuthService';
	import { onMount, onDestroy } from 'svelte';

	let { children } = $props();
	let isLoadingAuth = $state(true);
	let isInitialized = $state(false);
	let unsubscribe: (() => void) | null = null;

	onMount(async () => {
		// Initialize authentication state when the app loads
		const authService = AuthService.getInstance();
		
		// Check if user has a token stored
		const token = localStorage.getItem('auth_token');
		if (token) {
			try {
				const result = await authService.verifyToken();
				if (result.isValid && result.user) {
					// Token is valid, update auth store
					authStore.login(result.user, token);
				} else {
					// Token is invalid, clear it
					authStore.logout();
				}
			} catch (error) {
				console.error('Error verifying token:', error);
				authStore.logout();
			}
		}

		isLoadingAuth = false;
		isInitialized = true;

		// Subscribe to auth changes to handle protected routes
		unsubscribe = authStore.subscribe((state) => {
			const isAuthRoute = page.url.pathname.startsWith('/login') || 
											page.url.pathname.startsWith('/register');
			const isProtectedRoute = !page.url.pathname.startsWith('/login') && 
									!page.url.pathname.startsWith('/register') &&
									!page.url.pathname.startsWith('/reset-password') &&
									!page.url.pathname.startsWith('/forgot-password');
			
			
			if (isProtectedRoute && !state.isAuthenticated && isInitialized) {
				goto('/login');
			} else if (isAuthRoute && state.isAuthenticated && isInitialized) {
				// If user is authenticated and on auth route, redirect to home
				goto('/');
			}
		});
	});

	// Cleanup subscription on component destroy
	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isLoadingAuth}
	<div class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
			<p class="mt-4 text-gray-700">Initializing authentication...</p>
		</div>
	</div>
{:else}
	{@render children?.()}
{/if}