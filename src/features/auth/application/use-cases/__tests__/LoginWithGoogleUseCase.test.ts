import { LoginWithGoogleUseCase } from '../LoginWithGoogleUseCase';
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';

describe('LoginWithGoogleUseCase', () => {
  let loginWithGoogleUseCase: LoginWithGoogleUseCase;
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
    loginWithGoogleUseCase = new LoginWithGoogleUseCase(mockAuthRepository);
  });

  it('should authenticate user using Google token and save token', async () => {
    const mockResponse = { token: 'jwt-google-123', name: 'Google User', email: 'google@test.com' };
    mockAuthRepository.loginWithGoogle.mockResolvedValue(mockResponse);

    const result = await loginWithGoogleUseCase.execute('google-access-token');

    expect(result).toEqual(mockResponse);
    expect(mockAuthRepository.loginWithGoogle).toHaveBeenCalledWith('google-access-token');
    expect(mockAuthRepository.saveToken).toHaveBeenCalledWith('jwt-google-123');
  });
});
