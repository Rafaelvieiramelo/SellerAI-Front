import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }

  return 'http://192.168.1.8:8080';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  console.log('[API] Token found:', token ? `${token.substring(0, 20)}...` : 'NONE');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('[API] Request:', config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

type ApiErrorPayload = {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export const getApiErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError<ApiErrorPayload>(error)) {
    return 'Nao foi possivel concluir a operacao.';
  }

  const responseData = error.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.title) {
    return responseData.title;
  }

  const firstValidationError = responseData?.errors ? Object.values(responseData.errors).flat()[0] : undefined;

  if (firstValidationError) {
    return firstValidationError;
  }

  if (error.response?.status === 401) {
    return 'Sessao expirada ou usuario nao autorizado.';
  }

  return error.message || 'Erro inesperado ao comunicar com a API.';
};

export type ApiError = AxiosError<ApiErrorPayload>;
