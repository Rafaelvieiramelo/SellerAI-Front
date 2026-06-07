import { ListProductsUseCase } from '../ListProductsUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

describe('ListProductsUseCase', () => {
  let listProductsUseCase: ListProductsUseCase;
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
    listProductsUseCase = new ListProductsUseCase(mockProductRepository);
  });

  it('should list products and return result', async () => {
    const mockResult = { items: [], pageNumber: 1, pageSize: 10, totalCount: 0 };
    mockProductRepository.list.mockResolvedValue(mockResult);

    const result = await listProductsUseCase.execute({ pageNumber: 1, pageSize: 10 });

    expect(result).toEqual(mockResult);
    expect(mockProductRepository.list).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10 });
  });
});
