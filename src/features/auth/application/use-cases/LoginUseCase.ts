import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { LoginRequest, AuthResponse } from '../../domain/models/User';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.authRepository.login(data);
    await this.authRepository.saveToken(response.token);
    return response;
  }
}
