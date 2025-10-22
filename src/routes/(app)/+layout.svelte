<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authStore } from '../../application/stores/authStore';
  import type { User } from '../../core/models/User';

  let user: User | null = null;

  onMount(async () => {
    // Subscribe to auth changes to get user data
    authStore.subscribe((state) => {
      if (state.isAuthenticated) {
        user = state.user;
      }
    });
  });

  function handleLogout() {
    authStore.logout();
    goto('/login');
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-900">Svelte MVVM App</h1>
        </div>
        <div class="flex items-center">
          <div class="ml-3 relative">
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-gray-700">Welcome, {user?.name || user?.email}</span>
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