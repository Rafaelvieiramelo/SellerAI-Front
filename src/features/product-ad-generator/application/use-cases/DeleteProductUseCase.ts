import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    await this.productRepository.remove(id);
  }
}
