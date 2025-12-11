import type { AuthResponse, RegisterCredentials } from '../models/User';
import type { AuthRepository } from '../repositories/AuthRepository';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const coordinateRegex = /^-?\d+(\.\d+)?$/;

export class RegisterUseCase {
	constructor(private authRepository: AuthRepository) {}

	async execute(credentials: RegisterCredentials): Promise<AuthResponse> {
		if (!emailRegex.test(credentials.email)) {
			throw new Error('Invalid email format');
		}

		if (credentials.passwordRaw.trim().length < 8) {
			throw new Error('Password must be at least 8 characters');
		}

		const requiredFields: Array<keyof RegisterCredentials> = [
			'fullName',
			'firstName',
			'lastName',
			'username',
			'primaryBranchID',
			'userType',
			'gender',
			'birthPlace',
			'dateOfBirth',
			'nik',
			'phone',
			'address',
			'roleCode',
			'settings'
		];

		for (const field of requiredFields) {
			const value = credentials[field];
			if (typeof value !== 'string' || value.trim().length === 0) {
				throw new Error(`Field ${String(field)} is required`);
			}
		}

		if (
			!coordinateRegex.test(credentials.activityLat) ||
			!coordinateRegex.test(credentials.activityLon)
		) {
			throw new Error('Activity coordinate must be numeric');
		}

		if (
			!coordinateRegex.test(credentials.addressLat) ||
			!coordinateRegex.test(credentials.addressLon)
		) {
			throw new Error('Address coordinate must be numeric');
		}

		if (credentials.settings.trim()) {
			try {
				JSON.parse(credentials.settings);
			} catch (error) {
				console.error('Invalid settings JSON', error);
				throw new Error('Settings must be a valid JSON string');
			}
		}

		return this.authRepository.register(credentials);
	}
}
