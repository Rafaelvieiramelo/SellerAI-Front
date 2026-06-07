import { UpdateProductUseCase } from '../UpdateProductUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

describe('UpdateProductUseCase', () => {
  let updateProductUseCase: UpdateProductUseCase;
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
    updateProductUseCase = new UpdateProductUseCase(mockProductRepository);
  });

  it('should update an existing product', async () => {
    const mockProduct = { id: 'p-1', name: 'New Name', price: 109.9 } as any;
    mockProductRepository.update.mockResolvedValue(mockProduct);

    const requestData = { id: 'p-1', name: 'New Name', price: 109.9 } as any;
    const result = await updateProductUseCase.execute('p-1', requestData);

    expect(result).toEqual(mockProduct);
    expect(mockProductRepository.update).toHaveBeenCalledWith('p-1', requestData);
  });
});
