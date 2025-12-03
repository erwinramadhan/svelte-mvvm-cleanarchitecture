import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../models/User';

export interface AuthRepository {
	login(credentials: LoginCredentials): Promise<AuthResponse>;
	register(credentials: RegisterCredentials): Promise<AuthResponse>;
	verifyToken(): Promise<User>;
	logout(): Promise<void>;
}
