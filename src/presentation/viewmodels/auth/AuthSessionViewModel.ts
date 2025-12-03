import { writable } from 'svelte/store';
import type { User } from '$core/models/User';
import type { LocalStorageRepository } from '$core/repositories/LocalStorageRepository';
import type { LogoutUseCase } from '$core/usecases/LogoutUseCase';
import type { VerifyTokenUseCase } from '$core/usecases/VerifyTokenUseCase';
import type { AuthStore } from '$presentation/stores/authStore';

export class AuthSessionViewModel {
	initializing = writable(true);

	constructor(
		private verifyTokenUseCase: VerifyTokenUseCase,
		private logoutUseCase: LogoutUseCase,
		private authStore: AuthStore,
		private storage: LocalStorageRepository
	) {}

	async initialize(): Promise<{ authenticated: boolean; user?: User; error?: string }> {
		this.initializing.set(true);
		const token = this.storage.getItem('auth_token');

		if (!token) {
			this.authStore.reset();
			this.initializing.set(false);
			return { authenticated: false };
		}

		try {
			const user = await this.verifyTokenUseCase.execute();
			this.authStore.login(user, token);
			return { authenticated: true, user };
		} catch (err) {
			this.authStore.logout();
			return { authenticated: false, error: (err as Error).message };
		} finally {
			this.initializing.set(false);
		}
	}

	async logout() {
		await this.logoutUseCase.execute();
		this.authStore.logout();
	}
}
