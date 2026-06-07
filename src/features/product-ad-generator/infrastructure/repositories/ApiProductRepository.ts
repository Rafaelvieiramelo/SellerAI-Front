import { apiClient } from '../../../../core/infrastructure/api/client';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import {
  CreateProductRequest,
  GenerateProductAdResponse,
  Product,
  ProductListParams,
  ProductListResult,
  UpdateProductRequest,
} from '../../domain/models/Product';

type ProductListApiResponse =
  | Product[]
  | {
      items?: Product[];
      data?: Product[];
      results?: Product[];
      pageNumber?: number;
      pageSize?: number;
      totalCount?: number;
      totalPages?: number;
    };

const normalizeProductList = (
  response: ProductListApiResponse,
  params: Required<ProductListParams>,
): ProductListResult => {
  if (Array.isArray(response)) {
    return {
      items: response,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    };
  }

  return {
    items: response.items ?? response.data ?? response.results ?? [],
    pageNumber: response.pageNumber ?? params.pageNumber,
    pageSize: response.pageSize ?? params.pageSize,
    totalCount: response.totalCount,
    totalPages: response.totalPages,
  };
};

export class ApiProductRepository implements IProductRepository {
  async list(params: ProductListParams = {}): Promise<ProductListResult> {
    const pagination = {
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 10,
    };

    const response = await apiClient.get<ProductListApiResponse>('/api/products', {
      params: pagination,
    });

    return normalizeProductList(response.data, pagination);
  }

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/api/products/${id}`);
    return response.data;
  }

  async create(data: CreateProductRequest): Promise<Product> {
    console.log('[ApiProductRepository] POST /api/products', JSON.stringify(data, null, 2));
    const response = await apiClient.post<Product>('/api/products', data);
    console.log('[ApiProductRepository] Response:', response.status, JSON.stringify(response.data, null, 2));
    return response.data;
  }

  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    const response = await apiClient.put<Product>(`/api/products/${id}`, data);
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/api/products/${id}`);
  }

  async generateAd(productIds: string[]): Promise<GenerateProductAdResponse> {
    const response = await apiClient.post<GenerateProductAdResponse>('/api/anuncios/gerar', {
      ids: productIds,
    });

    return response.data;
  }
}
