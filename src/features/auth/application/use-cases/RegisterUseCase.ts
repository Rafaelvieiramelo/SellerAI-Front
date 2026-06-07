import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { RegisterRequest } from '../../domain/models/User';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterRequest): Promise<void> {
    await this.authRepository.register(data);
  }
}
