export const categories = ['Eletrônicos', 'Gamer', 'Casa', 'Moda', 'Pet', 'Decoração'] as const;
export const marketplaces = ['Shopee', 'Mercado Livre'] as const;
export const audiences = ['Gamer', 'Escritório', 'Fitness', 'Casa', 'Infantil'] as const;
export const tones = ['Profissional', 'Persuasivo', 'Premium', 'Jovem', 'Técnico'] as const;

export type ProductCategory = (typeof categories)[number];
export type Marketplace = (typeof marketplaces)[number];
export type Audience = (typeof audiences)[number];
export type AdTone = (typeof tones)[number];

export interface ProductAdFormData {
  productName: string;
  category: ProductCategory;
  sku: string;
  stockQuantity: number;
  costPrice: string;
  targetMargin: string;
  tone: AdTone;
  audience: Audience;
  features: string[];
  imageUri?: string;
  listings?: {
    marketplace: string;
    price: string;
    enabled: boolean;
  }[];
}

export interface GeneratedProductAd {
  seoTitle: string;
  description: string;
  hashtags: string[];
  seoScore: number;
  keywords: string[];
}
