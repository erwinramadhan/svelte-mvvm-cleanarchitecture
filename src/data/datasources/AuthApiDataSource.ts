import axiosInstance from '../../lib/api/axios-instance';
import type {
  AuthResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  VerifyResponseDTO,
  LogoutResponseDTO,
} from '../dtos/UserDTO';

export class AuthApiDataSource {
  async login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
    try {
      const response = await axiosInstance.post<AuthResponseDTO>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  async register(credentials: RegisterRequestDTO): Promise<AuthResponseDTO> {
    try {
      const response = await axiosInstance.post<AuthResponseDTO>('/auth/register', credentials);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  }

  async verifyToken(): Promise<VerifyResponseDTO> {
    try {
      const response = await axiosInstance.get<VerifyResponseDTO>('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Verify token API error:', error);
      throw error;
    }
  }

  async logout(): Promise<LogoutResponseDTO> {
    try {
      const response = await axiosInstance.post<LogoutResponseDTO>('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  }
}
