import { writable, type Readable } from 'svelte/store';
import type { User } from '$core/models/User';
import type { LocalStorageRepository } from '$core/repositories/LocalStorageRepository';

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	error: string | null;
}

export interface AuthStore extends Readable<AuthState> {
	login(user: User, token: string): void;
	logout(): void;
	updateUser(user: User): void;
	reset(): void;
}

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	error: null
};

function loadFromStorage(storage: LocalStorageRepository): AuthState {
	const token = storage.getItem('auth_token');
	const userStr = storage.getItem('auth_user');

	if (token && userStr) {
		try {
			const user = JSON.parse(userStr) as User;
			return {
				...initialState,
				user,
				token,
				isAuthenticated: true
			};
		} catch (error) {
			console.error('Failed to parse auth state from storage:', error);
		}
	}

	return initialState;
}

export function createAuthStore(storage: LocalStorageRepository): AuthStore {
	const { subscribe, set, update } = writable<AuthState>(loadFromStorage(storage));

	return {
		subscribe,
		login: (user: User, token: string) => {
			storage.setItem('auth_token', token);
			storage.setItem('auth_user', JSON.stringify(user));

			set({
				user,
				token,
				isAuthenticated: true,
				error: null
			});
		},
		logout: () => {
			storage.removeItem('auth_token');
			storage.removeItem('auth_user');
			set(initialState);
		},
		updateUser: (user: User) => {
			storage.setItem('auth_user', JSON.stringify(user));
			update((state) => ({
				...state,
				user
			}));
		},
		reset: () => {
			storage.removeItem('auth_token');
			storage.removeItem('auth_user');
			set(initialState);
		}
	};
}
