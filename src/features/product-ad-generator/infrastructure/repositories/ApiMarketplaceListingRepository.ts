import { apiClient } from '../../../../core/infrastructure/api/client';
import { MarketplaceListing, PublishProductRequest } from '../../domain/models/MarketplaceListing';

export class ApiMarketplaceListingRepository {
  async getByProductId(productId: string): Promise<MarketplaceListing[]> {
    const response = await apiClient.get<MarketplaceListing[]>(`/api/marketplace-listings/product/${productId}`);
    return response.data;
  }

  async publish(data: PublishProductRequest): Promise<MarketplaceListing> {
    const response = await apiClient.post<MarketplaceListing>('/api/marketplace-listings', data);
    return response.data;
  }
}
