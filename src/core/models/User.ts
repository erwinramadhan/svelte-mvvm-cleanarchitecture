export interface UserProfile {
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

export interface User extends UserProfile {
	id: string;
	email: string;
	name: string;
	created_at: string;
}

export interface AuthResponse {
	user: User;
	token: string;
	message: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials extends UserProfile {
	email: string;
	passwordRaw: string;
}
