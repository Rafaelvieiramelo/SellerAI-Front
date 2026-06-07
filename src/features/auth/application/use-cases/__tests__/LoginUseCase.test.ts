import { LoginUseCase } from '../LoginUseCase';
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
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
    loginUseCase = new LoginUseCase(mockAuthRepository);
  });

  it('should authenticate user and save token on success', async () => {
    const mockResponse = { token: 'jwt-123', name: 'Test', email: 'test@test.com' };
    mockAuthRepository.login.mockResolvedValue(mockResponse);

    const result = await loginUseCase.execute({ email: 'test@test.com', password: 'password' });

    expect(result).toEqual(mockResponse);
    expect(mockAuthRepository.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
    expect(mockAuthRepository.saveToken).toHaveBeenCalledWith('jwt-123');
  });
});
