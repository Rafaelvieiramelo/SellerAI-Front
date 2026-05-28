import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/api';
import { LoginRequest, RegisterRequest } from '../types/auth';

interface AuthContextData {
  token: string | null;
  user: { name: string; email: string } | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = async (data: LoginRequest) => {
    const res = await authApi.login(data);
    await AsyncStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser({ name: res.data.name, email: res.data.email });
  };

  const register = async (data: RegisterRequest) => {
    await authApi.register(data);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const loginWithGoogle = async (accessToken: string) => {
    const res = await authApi.loginWithGoogle(accessToken);
    await AsyncStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser({ name: res.data.name, email: res.data.email });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);