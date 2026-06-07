import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { CreateProductRequest, Product } from '../../domain/models/Product';

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: CreateProductRequest): Promise<Product> {
    return await this.productRepository.create(data);
  }
}
