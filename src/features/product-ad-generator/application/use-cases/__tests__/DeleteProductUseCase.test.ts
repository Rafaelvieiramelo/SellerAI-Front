import { DeleteProductUseCase } from '../DeleteProductUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

describe('DeleteProductUseCase', () => {
  let deleteProductUseCase: DeleteProductUseCase;
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
    deleteProductUseCase = new DeleteProductUseCase(mockProductRepository);
  });

  it('should remove a product by ID', async () => {
    mockProductRepository.remove.mockResolvedValue(undefined);

    await deleteProductUseCase.execute('p-1');

    expect(mockProductRepository.remove).toHaveBeenCalledWith('p-1');
  });
});
