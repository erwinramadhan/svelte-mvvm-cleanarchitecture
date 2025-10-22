import type { User } from '../../core/models/User';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { AuthApiDataSource } from '../../data/datasources/AuthApiDataSource';
import { authStore } from '../../application/stores/authStore';

export class AuthService {
  private static instance: AuthService;
  private authRepository: AuthRepositoryImpl;

  private constructor() {
    this.authRepository = new AuthRepositoryImpl(new AuthApiDataSource());
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async verifyToken(): Promise<{ isValid: boolean; user?: User }> {
    try {
      const user = await this.authRepository.verifyToken();
      return { isValid: true, user };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { isValid: false };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authRepository.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    } finally {
      // Use authStore's logout method which handles localStorage
      authStore.logout();
    }
  }
}