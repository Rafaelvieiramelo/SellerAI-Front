export interface MarketplaceListing {
  id: string;
  productId: string;
  marketplace: string;
  externalId: string;
  url: string;
  status: string;
  publishedAt: string;
}

export interface PublishProductRequest {
  productId: string;
  marketplace: string;
  externalId: string;
  url: string;
  status: string;
}
