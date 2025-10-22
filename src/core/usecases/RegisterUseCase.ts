import type { AuthRepository } from '../repositories/AuthRepository';
import type { AuthResponse, RegisterCredentials } from '../models/User';

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (credentials.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Validate name
    if (credentials.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    return this.authRepository.register(credentials);
  }
}
