import { z } from 'zod';
import { audiences, categories, marketplaces, tones } from '../domain/productAdTypes';

const currencyString = z
  .string()
  .min(1, 'Informe um valor')
  .refine((value) => Number.isFinite(Number(value.replace(',', '.'))), 'Use um valor válido');

const listingSchema = z.object({
  marketplace: z.string(),
  price: z.string(),
  enabled: z.boolean(),
});

export const productAdSchema = z.object({
  productName: z.string().trim().min(3, 'Informe ao menos 3 caracteres'),
  category: z.enum(categories),
  sku: z.string().trim().min(2, 'Informe o SKU (mín. 2 chars)'),
  stockQuantity: z.number().int().nonnegative('Estoque não pode ser negativo'),
  costPrice: currencyString,
  targetMargin: currencyString,
  tone: z.enum(tones),
  audience: z.enum(audiences),
  features: z.array(z.string().trim().min(2)).min(2, 'Adicione pelo menos 2 características'),
  imageUri: z.string().optional(),
  listings: z.array(listingSchema).optional(),
});
