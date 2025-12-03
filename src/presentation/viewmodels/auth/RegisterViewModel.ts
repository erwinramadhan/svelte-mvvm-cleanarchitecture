import { writable } from 'svelte/store';
import type { AuthResponse, RegisterCredentials } from '$core/models/User';
import type { RegisterUseCase } from '$core/usecases/RegisterUseCase';
import type { AuthStore } from '$presentation/stores/authStore';

export class RegisterViewModel {
	isLoading = writable(false);
	error = writable<string | null>(null);

	constructor(
		private registerUseCase: RegisterUseCase,
		private authStore: AuthStore
	) {}

	async register(
		credentials: RegisterCredentials
	): Promise<{ success: boolean; user?: AuthResponse['user']; error?: string }> {
		this.isLoading.set(true);
		this.error.set(null);

		try {
			const result: AuthResponse = await this.registerUseCase.execute(credentials);
			this.authStore.login(result.user, result.token);
			return { success: true, user: result.user };
		} catch (err) {
			const message = (err as Error).message || 'Registration failed. Please try again.';
			this.error.set(message);
			return { success: false, error: message };
		} finally {
			this.isLoading.set(false);
		}
	}

	clearError() {
		this.error.set(null);
	}
}
