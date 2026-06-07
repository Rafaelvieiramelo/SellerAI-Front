import {
  CreateProductRequest,
  GenerateProductAdResponse,
  Product,
  ProductListParams,
  ProductListResult,
  UpdateProductRequest,
} from '../models/Product';

export interface IProductRepository {
  list(params: ProductListParams): Promise<ProductListResult>;
  getById(id: string): Promise<Product>;
  create(data: CreateProductRequest): Promise<Product>;
  update(id: string, data: UpdateProductRequest): Promise<Product>;
  remove(id: string): Promise<void>;
  generateAd(productIds: string[]): Promise<GenerateProductAdResponse>;
}
