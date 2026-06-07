import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { GenerateProductAdResponse } from '../../domain/models/Product';

export class GenerateAdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productIds: string[]): Promise<GenerateProductAdResponse> {
    return await this.productRepository.generateAd(productIds);
  }
}
