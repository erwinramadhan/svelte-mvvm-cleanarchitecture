import type { User } from '$core/models/User';
import type { AuthRepository } from '$core/repositories/AuthRepository';

export class VerifyTokenUseCase {
	constructor(private authRepository: AuthRepository) {}

	async execute(): Promise<User> {
		return this.authRepository.verifyToken();
	}
}
