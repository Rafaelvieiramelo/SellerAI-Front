import { GenerateAdUseCase } from '../GenerateAdUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

describe('GenerateAdUseCase', () => {
  let generateAdUseCase: GenerateAdUseCase;
  let mockProductRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    mockProductRepository = {
      list: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      generateAd: jest.fn(),
    };
    generateAdUseCase = new GenerateAdUseCase(mockProductRepository);
  });

  it('should generate ads for a list of products', async () => {
    const mockResponse = [{ id: 'p-1', generatedTitulo: 'Title' }] as any;
    mockProductRepository.generateAd.mockResolvedValue(mockResponse);

    const result = await generateAdUseCase.execute(['p-1']);

    expect(result).toEqual(mockResponse);
    expect(mockProductRepository.generateAd).toHaveBeenCalledWith(['p-1']);
  });
});
