import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

//const BASE_URL = 'http://localhost:8080'; // troque pelo IP da sua máquina no Android
const BASE_URL = 'http://192.168.1.3:8080'; // troque pelo IP da sua máquina no Android

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data),
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/api/auth/register', data),
  loginWithGoogle: (accessToken: string) =>
  api.post<AuthResponse>('/api/auth/google', { accessToken }),
};