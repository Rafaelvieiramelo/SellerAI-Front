import { apiClient } from '../services/api/client';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<AuthResponse>('/api/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post<AuthResponse>('/api/auth/register', data),
  loginWithGoogle: (accessToken: string) => apiClient.post<AuthResponse>('/api/auth/google', { accessToken }),
};
