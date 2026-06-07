import { CreateProductUseCase } from '../CreateProductUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

describe('CreateProductUseCase', () => {
  let createProductUseCase: CreateProductUseCase;
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
    createProductUseCase = new CreateProductUseCase(mockProductRepository);
  });

  it('should create a product', async () => {
    const mockProduct = { id: 'p-1', name: 'Product Name', price: 99.9 } as any;
    mockProductRepository.create.mockResolvedValue(mockProduct);

    const requestData = { name: 'Product Name', price: 99.9 } as any;
    const result = await createProductUseCase.execute(requestData);

    expect(result).toEqual(mockProduct);
    expect(mockProductRepository.create).toHaveBeenCalledWith(requestData);
  });
});
