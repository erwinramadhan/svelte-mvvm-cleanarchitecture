export interface UserDTO {
	id: string;
	email: string;
	name: string;
	created_at: string;
}

export interface AuthResponseDTO {
	user: UserDTO;
	token: string;
	message: string;
}

export interface LoginRequestDTO {
	email: string;
	password: string;
}

export interface RegisterRequestDTO {
	email: string;
	password: string;
	name: string;
}

export interface VerifyResponseDTO {
	user: UserDTO;
	valid: boolean;
}

export interface LogoutResponseDTO {
	message: string;
}
