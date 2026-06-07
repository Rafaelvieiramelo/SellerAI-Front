import { LogoutUseCase } from '../LogoutUseCase';
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase;
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
    logoutUseCase = new LogoutUseCase(mockAuthRepository);
  });

  it('should clear stored auth token on logout', async () => {
    mockAuthRepository.removeToken.mockResolvedValue(undefined);

    await logoutUseCase.execute();

    expect(mockAuthRepository.removeToken).toHaveBeenCalled();
  });
});
