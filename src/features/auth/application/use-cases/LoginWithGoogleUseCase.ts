import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthResponse } from '../../domain/models/User';

export class LoginWithGoogleUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(accessToken: string): Promise<AuthResponse> {
    const response = await this.authRepository.loginWithGoogle(accessToken);
    await this.authRepository.saveToken(response.token);
    return response;
  }
}
