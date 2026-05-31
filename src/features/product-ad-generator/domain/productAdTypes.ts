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
  marketplace: Marketplace;
  features: string[];
  audience: Audience;
  costPrice: string;
  salePrice: string;
  targetMargin: string;
  tone: AdTone;
  imageUri?: string;
}

export interface GeneratedProductAd {
  seoTitle: string;
  description: string;
  hashtags: string[];
  seoScore: number;
  keywords: string[];
}
