import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { UpdateProductRequest, Product } from '../../domain/models/Product';

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, data: UpdateProductRequest): Promise<Product> {
    return await this.productRepository.update(id, data);
  }
}
