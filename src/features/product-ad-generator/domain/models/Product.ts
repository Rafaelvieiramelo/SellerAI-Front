import { ProductAdFormData } from '../productAdTypes';

export interface Product {
  id: string;
  name: string;
  category: string | null;
  marketplace: string | null;
  features: string[];
  targetAudience: string | null;
  price: number;
  tone: string | null;
  generatedTitulo?: string;
  generatedDescricao?: string;
  generatedTags?: string[];
  generatedCaracteristicasDestaque?: string[];
  generatedCta?: string;
  isGeneratedByAI?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface ProductListResult {
  items: Product[];
  pageNumber: number;
  pageSize: number;
  totalCount?: number;
  totalPages?: number;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  marketplace: string;
  features: string[];
  targetAudience: string;
  price: number;
  tone: string;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: string;
}

export interface GenerateProductAdRequest {
  ids: string[];
}

export type GenerateProductAdResponse = Product[] | Product | Record<string, unknown> | null;

export const productFormToCreateRequest = (data: ProductAdFormData): CreateProductRequest => ({
  name: data.productName.trim(),
  category: data.category,
  marketplace: data.marketplace,
  features: data.features.map((feature) => feature.trim()).filter(Boolean),
  targetAudience: data.audience,
  price: Number(data.salePrice.replace(',', '.')) || 0,
  tone: data.tone,
});
