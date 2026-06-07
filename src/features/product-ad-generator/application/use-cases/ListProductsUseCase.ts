import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ProductListParams, ProductListResult } from '../../domain/models/Product';

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(params: ProductListParams): Promise<ProductListResult> {
    return await this.productRepository.list(params);
  }
}
