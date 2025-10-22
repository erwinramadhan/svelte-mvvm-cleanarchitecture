<script lang="ts">
  import { onMount } from 'svelte';
  import { RegisterViewModel } from '../../../application/viewmodels/RegisterViewModel';
  import { goto } from '$app/navigation';

  let viewModel: RegisterViewModel;
  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error: string | null = null;
  let isLoading = false;

  onMount(() => {
    viewModel = new RegisterViewModel();

    // Subscribe to error changes
    const unsubscribeError = viewModel.error.subscribe((value) => {
      error = value;
    });

    // Subscribe to loading changes
    const unsubscribeLoading = viewModel.isLoading.subscribe((value) => {
      isLoading = value;
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeError();
      unsubscribeLoading();
    };
  });

  async function handleRegister() {
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    const credentials = { 
      name, 
      email, 
      password 
    };
    
    const result = await viewModel.register(credentials);

    if (result.success) {
      // Redirect to dashboard or home page after successful registration
      goto('/demo');
    } else {
      // Error is already handled by the subscription
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create a new account
      </h2>
      {#if error}
        <div class="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{error}</span>
        </div>
      {/if}
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleRegister}>
      <input type="hidden" name="remember" value="true" />
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="name" class="sr-only">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Full Name"
            bind:value={name}
          />
        </div>
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            bind:value={email}
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            bind:value={password}
          />
        </div>
        <div>
          <label for="confirm-password" class="sr-only">Confirm Password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Confirm Password"
            bind:value={confirmPassword}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLoading}
        >
          {#if isLoading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          {:else}
            Create account
          {/if}
        </button>
      </div>
      
      <div class="text-sm text-center">
        <p class="text-gray-600">Already have an account? 
          <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
        </p>
      </div>
    </form>
  </div>
</div>