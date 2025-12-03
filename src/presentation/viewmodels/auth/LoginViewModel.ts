import { writable } from 'svelte/store';
import type { AuthResponse, LoginCredentials } from '$core/models/User';
import type { LoginUseCase } from '$core/usecases/LoginUseCase';
import type { AuthStore } from '$presentation/stores/authStore';

export class LoginViewModel {
	isLoading = writable(false);
	error = writable<string | null>(null);

	constructor(
		private loginUseCase: LoginUseCase,
		private authStore: AuthStore
	) {}

	async login(
		credentials: LoginCredentials
	): Promise<{ success: boolean; user?: AuthResponse['user']; error?: string }> {
		this.isLoading.set(true);
		this.error.set(null);

		try {
			const result: AuthResponse = await this.loginUseCase.execute(credentials);
			this.authStore.login(result.user, result.token);
			return { success: true, user: result.user };
		} catch (err) {
			const message = (err as Error).message || 'Login failed. Please try again.';
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
