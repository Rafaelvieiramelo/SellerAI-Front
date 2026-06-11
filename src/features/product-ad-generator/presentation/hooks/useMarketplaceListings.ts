import { useState, useCallback, useEffect } from 'react';
import { MarketplaceListing, PublishProductRequest } from '../../domain/models/MarketplaceListing';
import { ApiMarketplaceListingRepository } from '../../infrastructure/repositories/ApiMarketplaceListingRepository';
import { getApiErrorMessage } from '../../../../core/infrastructure/api/client';

const repository = new ApiMarketplaceListingRepository();

export function useMarketplaceListings(productId: string | undefined) {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await repository.getByProductId(productId);
      setListings(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const publishListing = useCallback(async (marketplace: string, externalId: string, url: string) => {
    if (!productId) return;
    setPublishing(true);
    setError(null);
    setSuccess(null);
    try {
      const request: PublishProductRequest = {
        productId,
        marketplace,
        externalId,
        url,
        status: 'Active',
      };
      const newListing = await repository.publish(request);
      setListings((current) => [newListing, ...current]);
      setSuccess('Anúncio registrado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getApiErrorMessage(err));
      throw err;
    } finally {
      setPublishing(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  return {
    listings,
    loading,
    publishing,
    error,
    success,
    clearError: useCallback(() => setError(null), []),
    clearSuccess: useCallback(() => setSuccess(null), []),
    publishListing,
    reload: loadListings,
  };
}
