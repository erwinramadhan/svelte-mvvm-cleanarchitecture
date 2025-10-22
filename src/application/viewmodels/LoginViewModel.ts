import { LoginUseCase } from '../../core/usecases/LoginUseCase';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { AuthApiDataSource } from '../../data/datasources/AuthApiDataSource';
import type { AuthResponse, LoginCredentials } from '../../core/models/User';
import { authStore } from '../stores/authStore';
import { writable } from 'svelte/store';

export class LoginViewModel {
  private loginUseCase: LoginUseCase;
  private _isLoading = writable(false);
  private _error = writable<string | null>(null);

  constructor() {
    const authRepository = new AuthRepositoryImpl(new AuthApiDataSource());
    this.loginUseCase = new LoginUseCase(authRepository);
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: any; error?: string }> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const result: AuthResponse = await this.loginUseCase.execute(credentials);
      
      // Store the user and token in auth store
      authStore.login(result.user, result.token);
      
      return { success: true, user: result.user };
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      console.error('Login error:', error);
      this._error.set(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      this._isLoading.set(false);
    }
  }

  clearError() {
    this._error.set(null);
  }
}