import { Product } from '../domain/models/Product';
import {
  audiences,
  categories,
  marketplaces,
  ProductAdFormData,
  tones,
} from '../domain/productAdTypes';

const defaultValues: ProductAdFormData = {
  productName: '',
  category: 'Eletrônicos',
  marketplace: 'Shopee',
  features: ['Bluetooth 5.3', 'RGB', 'Baixa Latência'],
  audience: 'Gamer',
  costPrice: '',
  salePrice: '',
  targetMargin: '30',
  tone: 'Persuasivo',
  imageUri: undefined,
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

export const readString = (product: Product, camelKey: keyof Product, pascalKey: string) => {
  const fallbackValue = (product as unknown as Record<string, unknown>)[pascalKey];
  const value = product[camelKey] ?? fallbackValue;
  return typeof value === 'string' ? value : '';
};

export const readStringList = (product: Product, camelKey: keyof Product, pascalKey: string) => {
  const fallbackValue = (product as unknown as Record<string, unknown>)[pascalKey];
  const value = product[camelKey] ?? fallbackValue;
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
};

export const readBoolean = (product: Product, camelKey: keyof Product, pascalKey: string) => {
  const fallbackValue = (product as unknown as Record<string, unknown>)[pascalKey];
  const value = product[camelKey] ?? fallbackValue;
  return typeof value === 'boolean' ? value : false;
};

export const getGeneratedProductFields = (product: Product) => ({
  titulo: readString(product, 'generatedTitulo', 'GeneratedTitulo'),
  descricao: readString(product, 'generatedDescricao', 'GeneratedDescricao'),
  tags: readStringList(product, 'generatedTags', 'GeneratedTags'),
  caracteristicasDestaque: readStringList(
    product,
    'generatedCaracteristicasDestaque',
    'GeneratedCaracteristicasDestaque'
  ),
  cta: readString(product, 'generatedCta', 'GeneratedCta'),
  isGeneratedByAI: readBoolean(product, 'isGeneratedByAI', 'IsGeneratedByAI'),
  createdAt: readString(product, 'createdAt', 'CreatedAt'),
});

export const hasGeneratedContent = (product: Product) => {
  const generated = getGeneratedProductFields(product);

  return Boolean(
    generated.isGeneratedByAI ||
      generated.titulo ||
      generated.descricao ||
      generated.tags.length ||
      generated.caracteristicasDestaque.length ||
      generated.cta
  );
};

export const productToFormData = (product: Product): ProductAdFormData => ({
  productName: product.name ?? '',
  category: firstAllowedValue(product.category, categories, defaultValues.category),
  marketplace: firstAllowedValue(product.marketplace, marketplaces, defaultValues.marketplace),
  features: product.features?.length ? product.features : defaultValues.features,
  audience: firstAllowedValue(product.targetAudience, audiences, defaultValues.audience),
  costPrice: '0',
  salePrice: String(product.price ?? ''),
  targetMargin: defaultValues.targetMargin,
  tone: firstAllowedValue(product.tone, tones, defaultValues.tone),
  imageUri: undefined,
});
