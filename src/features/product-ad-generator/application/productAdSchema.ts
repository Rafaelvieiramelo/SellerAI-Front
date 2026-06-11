import { z } from 'zod';
import { audiences, categories, marketplaces, tones } from '../domain/productAdTypes';

const currencyString = z
  .string()
  .min(1, 'Informe um valor')
  .refine((value) => Number.isFinite(Number(value.replace(',', '.'))), 'Use um valor válido');

const variationSchema = z.object({
  id: z.string().optional(),
  color: z.string().trim(),
  size: z.string().trim(),
  sku: z.string().trim().min(2, 'Informe o SKU (mín. 2 chars)'),
  stockQuantity: z.number().int().nonnegative('Estoque não pode ser negativo'),
  price: z.number().nullable(),
});

export const productAdSchema = z.object({
  productName: z.string().trim().min(3, 'Informe ao menos 3 caracteres'),
  category: z.enum(categories),
  marketplace: z.enum(marketplaces),
  features: z.array(z.string().trim().min(2)).min(2, 'Adicione pelo menos 2 características'),
  audience: z.enum(audiences),
  costPrice: currencyString,
  salePrice: currencyString,
  targetMargin: currencyString,
  tone: z.enum(tones),
  imageUri: z.string().optional(),
  variations: z.array(variationSchema).optional(),
});
