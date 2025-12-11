import { isAxiosError } from 'axios';
import type { AxiosError } from 'axios';
import type { AuthRepository } from '$core/repositories/AuthRepository';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '$core/models/User';
import { AuthApiDataSource } from '$data/datasources/AuthApiDataSource';

type ApiError = AxiosError<{ message?: string }>;

export class AuthRepositoryImpl implements AuthRepository {
	private dataSource: AuthApiDataSource;

	constructor(dataSource: AuthApiDataSource) {
		this.dataSource = dataSource;
	}

	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		try {
			const response = await this.dataSource.login(credentials);
			return {
				user: {
					...response.user,
					name: response.user.name || response.user.fullName
				},
				token: response.token,
				message: response.message
			};
		} catch (error: unknown) {
			if (isAxiosError<ApiError>(error)) {
				if (error.response?.status === 401) {
					throw new Error('Invalid email or password');
				}
				throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
			}
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Login failed. Please try again.');
		}
	}

	async register(credentials: RegisterCredentials): Promise<AuthResponse> {
		try {
			const response = await this.dataSource.register(credentials);
			return {
				user: {
					...response.user,
					name: response.user.name || response.user.fullName
				},
				token: response.token,
				message: response.message
			};
		} catch (error: unknown) {
			if (isAxiosError<ApiError>(error)) {
				if (error.response?.status === 409) {
					throw new Error('Email already exists');
				}
				throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
			}
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Registration failed. Please try again.');
		}
	}

	async verifyToken(): Promise<User> {
		try {
			const response = await this.dataSource.verifyToken();
			return response.user;
		} catch (error: unknown) {
			console.error('Token verification failed:', error);
			throw new Error('Invalid or expired token');
		}
	}

	async logout(): Promise<void> {
		try {
			await this.dataSource.logout();
		} catch (error: unknown) {
			console.error('Logout failed:', error);
			throw new Error('Logout failed. Please try again.');
		}
	}
}
