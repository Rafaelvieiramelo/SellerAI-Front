import { RegisterUseCase } from '../RegisterUseCase';
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      login: jest.fn(),
      register: jest.fn(),
      loginWithGoogle: jest.fn(),
      saveToken: jest.fn(),
      getToken: jest.fn(),
      removeToken: jest.fn(),
    };
    registerUseCase = new RegisterUseCase(mockAuthRepository);
  });

  it('should register a new user on success', async () => {
    mockAuthRepository.register.mockResolvedValue(undefined);

    const requestData = { name: 'New User', email: 'new@test.com', password: 'password' };
    await registerUseCase.execute(requestData);

    expect(mockAuthRepository.register).toHaveBeenCalledWith(requestData);
  });
});
