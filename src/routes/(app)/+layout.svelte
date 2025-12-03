<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore, createAuthSessionViewModel } from '$application/container';
	import type { User } from '$core/models/User';

	const sessionViewModel = createAuthSessionViewModel();
	const auth = authStore;
	let user: User | null = null;

	onMount(() => {
		const unsubscribe = auth.subscribe((state) => {
			user = state.user;
		});

		return () => unsubscribe();
	});

	async function handleLogout() {
		await sessionViewModel.logout();
		goto('/login');
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex items-center">
					<h1 class="text-xl font-semibold text-gray-900">Svelte MVVM App</h1>
				</div>
				<div class="flex items-center">
					<div class="relative ml-3">
						<div class="flex items-center space-x-4">
							<span class="text-sm font-medium text-gray-700"
								>Welcome, {user?.name || user?.email}</span
							>
							<button
								class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
								on:click={handleLogout}
							>
								Sign out
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<main>
		<slot />
	</main>
</div>
