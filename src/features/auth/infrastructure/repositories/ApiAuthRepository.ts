import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../../../../core/infrastructure/api/client';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../domain/models/User';

export class ApiAuthRepository implements IAuthRepository {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<void> {
    await apiClient.post<AuthResponse>('/api/auth/register', data);
  }

  async loginWithGoogle(accessToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/google', { accessToken });
    return response.data;
  }

  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem('token', token);
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem('token');
  }
}
