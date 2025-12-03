import type { AuthRepository } from '../repositories/AuthRepository';
import type { AuthResponse, LoginCredentials } from '../models/User';

export class LoginUseCase {
	constructor(private authRepository: AuthRepository) {}

	async execute(credentials: LoginCredentials): Promise<AuthResponse> {
		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(credentials.email)) {
			throw new Error('Invalid email format');
		}

		// Validate password length
		if (credentials.password.length < 6) {
			throw new Error('Password must be at least 6 characters');
		}

		try {
			return await this.authRepository.login(credentials);
		} catch (error) {
			console.error('Login use case error:', error);
			throw error;
		}
	}
}
