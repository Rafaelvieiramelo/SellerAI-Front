import React, { createContext, useContext, useState } from 'react';
import { ApiAuthRepository } from '../../infrastructure/repositories/ApiAuthRepository';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase';
import { LoginWithGoogleUseCase } from '../../application/use-cases/LoginWithGoogleUseCase';
import { LogoutUseCase } from '../../application/use-cases/LogoutUseCase';
import { LoginRequest, RegisterRequest, User } from '../../domain/models/User';

interface AuthContextData {
  token: string | null;
  user: User | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const authRepository = new ApiAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);
const loginWithGoogleUseCase = new LoginWithGoogleUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (data: LoginRequest) => {
    const res = await loginUseCase.execute(data);
    setToken(res.token);
    setUser({ name: res.name, email: res.email });
  };

  const register = async (data: RegisterRequest) => {
    await registerUseCase.execute(data);
  };

  const logout = async () => {
    await logoutUseCase.execute();
    setToken(null);
    setUser(null);
  };

  const loginWithGoogle = async (accessToken: string) => {
    const res = await loginWithGoogleUseCase.execute(accessToken);
    setToken(res.token);
    setUser({ name: res.name, email: res.email });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
