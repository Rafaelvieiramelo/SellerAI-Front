import { LoginRequest, RegisterRequest, AuthResponse } from '../models/User';

export interface IAuthRepository {
  login(data: LoginRequest): Promise<AuthResponse>;
  register(data: RegisterRequest): Promise<void>;
  loginWithGoogle(accessToken: string): Promise<AuthResponse>;
  saveToken(token: string): Promise<void>;
  getToken(): Promise<string | null>;
  removeToken(): Promise<void>;
}
