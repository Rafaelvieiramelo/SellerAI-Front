import { ProductAdFormData } from '../productAdTypes';

export interface ProductListing {
  id?: string;
  productId?: string;
  marketplace: string;
  externalId?: string;
  url?: string;
  price: number;
  status: string;
  publishedAt?: string;
  generatedTitulo?: string;
  generatedDescricao?: string;
  generatedTags?: string[];
  generatedCaracteristicasDestaque?: string[];
  generatedCta?: string;
  isGeneratedByAI?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string | null;
  sku: string;
  stockQuantity: number;
  costPrice: number;
  features: string[];
  targetAudience: string | null;
  tone: string | null;
  createdAt?: string;
  updatedAt?: string;
  listings?: ProductListing[];
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

export interface ProductListingRequest {
  marketplace: string;
  price: number;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  sku: string;
  stockQuantity: number;
  costPrice: number;
  features: string[];
  targetAudience: string;
  tone: string;
  listings?: ProductListingRequest[];
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
  sku: data.sku.trim(),
  stockQuantity: data.stockQuantity,
  costPrice: Number(data.costPrice.replace(',', '.')) || 0,
  features: data.features.map((feature) => feature.trim()).filter(Boolean),
  targetAudience: data.audience,
  tone: data.tone,
  listings: (data.listings || [])
    .filter((l) => l.enabled)
    .map((l) => ({
      marketplace: l.marketplace,
      price: Number(l.price.replace(',', '.')) || 0,
    })),
});
