export interface UserProfileDTO {
	fullName: string;
	firstName: string;
	lastName: string;
	username: string;
	primaryBranchID: string;
	userType: string;
	activityLat: string;
	activityLon: string;
	gender: string;
	birthPlace: string;
	dateOfBirth: string;
	nik: string;
	nationality: string;
	religion: string;
	maritalStatus: string;
	phone: string;
	address: string;
	profession: string;
	addressLat: string;
	addressLon: string;
	settings: string;
	roleCode: string;
}

export interface UserDTO extends UserProfileDTO {
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

export interface RegisterRequestDTO extends UserProfileDTO {
	email: string;
	passwordRaw: string;
}

export interface VerifyResponseDTO {
	user: UserDTO;
	valid: boolean;
}

export interface LogoutResponseDTO {
	message: string;
}
