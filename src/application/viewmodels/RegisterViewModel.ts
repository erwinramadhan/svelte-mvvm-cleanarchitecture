import { RegisterUseCase } from '../../core/usecases/RegisterUseCase';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { AuthApiDataSource } from '../../data/datasources/AuthApiDataSource';
import type { AuthResponse, RegisterCredentials } from '../../core/models/User';
import { authStore } from '../stores/authStore';
import { writable } from 'svelte/store';

export class RegisterViewModel {
  private registerUseCase: RegisterUseCase;
  private _isLoading = writable(false);
  private _error = writable<string | null>(null);

  constructor() {
    const authRepository = new AuthRepositoryImpl(new AuthApiDataSource());
    this.registerUseCase = new RegisterUseCase(authRepository);
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: any; error?: string }> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const result: AuthResponse = await this.registerUseCase.execute(credentials);
      
      // Store the user and token in auth store
      authStore.login(result.user, result.token);
      
      return { success: true, user: result.user };
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
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