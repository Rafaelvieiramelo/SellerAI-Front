import { Product } from '../domain/models/Product';
import {
  audiences,
  categories,
  ProductAdFormData,
  tones,
} from '../domain/productAdTypes';

const defaultValues: ProductAdFormData = {
  productName: '',
  category: 'Eletrônicos',
  sku: '',
  stockQuantity: 0,
  costPrice: '',
  targetMargin: '30',
  tone: 'Persuasivo',
  audience: 'Gamer',
  features: ['Bluetooth 5.3', 'RGB', 'Baixa Latência'],
  imageUri: undefined,
  listings: [
    { marketplace: 'Shopee', price: '', enabled: false },
    { marketplace: 'Mercado Livre', price: '', enabled: false },
  ],
};

export const firstAllowedValue = <T extends readonly string[]>(
  value: string | null | undefined,
  allowed: T,
  fallback: T[number]
) => (allowed.includes(value ?? '') ? (value as T[number]) : fallback);

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

export const formatDate = (value?: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

export const getGeneratedProductFields = (product: Product) => {
  const firstWithAi = product.listings?.find((l) => l.isGeneratedByAI || l.generatedTitulo);
  const target = firstWithAi || product.listings?.[0];
  return {
    titulo: target?.generatedTitulo || '',
    descricao: target?.generatedDescricao || '',
    tags: target?.generatedTags || [],
    caracteristicasDestaque: target?.generatedCaracteristicasDestaque || [],
    cta: target?.generatedCta || '',
    isGeneratedByAI: target?.isGeneratedByAI || false,
    createdAt: target?.publishedAt || product.createdAt || '',
  };
};

export const hasGeneratedContent = (product: Product) => {
  return product.listings?.some((l) => l.isGeneratedByAI || l.generatedTitulo) ?? false;
};

export const productToFormData = (product: Product): ProductAdFormData => {
  const mlListing = product.listings?.find(
    (l) => l.marketplace.toLowerCase().includes('mercado') || l.marketplace === 'ML'
  );
  const shopeeListing = product.listings?.find((l) => l.marketplace.toLowerCase().includes('shopee'));

  return {
    productName: product.name ?? '',
    category: firstAllowedValue(product.category, categories, defaultValues.category),
    sku: product.sku ?? '',
    stockQuantity: product.stockQuantity ?? 0,
    costPrice: product.costPrice !== undefined && product.costPrice !== null ? String(product.costPrice) : '',
    targetMargin: defaultValues.targetMargin,
    tone: firstAllowedValue(product.tone, tones, defaultValues.tone),
    audience: firstAllowedValue(product.targetAudience, audiences, defaultValues.audience),
    features: product.features?.length ? product.features : defaultValues.features,
    listings: [
      {
        marketplace: 'Shopee',
        price: shopeeListing ? String(shopeeListing.price) : '',
        enabled: !!shopeeListing,
      },
      {
        marketplace: 'Mercado Livre',
        price: mlListing ? String(mlListing.price) : '',
        enabled: !!mlListing,
      },
    ],
  };
};
