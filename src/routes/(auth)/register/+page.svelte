<script lang="ts">
	import { goto } from '$app/navigation';
	import { createRegisterViewModel } from '$application/container';

	const viewModel = createRegisterViewModel();
	const error = viewModel.error;
	const isLoading = viewModel.isLoading;

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';

	async function handleRegister() {
		if (password !== confirmPassword) {
			error.set('Passwords do not match');
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
			goto('/');
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
			{#if $error}
				<div
					class="relative mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700"
					role="alert"
				>
					<span class="block sm:inline">{$error}</span>
				</div>
			{/if}
		</div>
		<form class="mt-8 space-y-6" on:submit|preventDefault={handleRegister}>
			<input type="hidden" name="remember" value="true" />
			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="name" class="sr-only">Full Name</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
						class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
						class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
						class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
						placeholder="Confirm Password"
						bind:value={confirmPassword}
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
					disabled={$isLoading}
				>
					{#if $isLoading}
						<svg
							class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Creating account...
					{:else}
						Create account
					{/if}
				</button>
			</div>

			<div class="text-center text-sm">
				<p class="text-gray-600">
					Already have an account?
					<a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
				</p>
			</div>
		</form>
	</div>
</div>
