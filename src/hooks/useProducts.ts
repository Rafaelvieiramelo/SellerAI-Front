import { useCallback, useEffect, useState } from 'react';
import { ProductService } from '../services/ProductService';
import { getApiErrorMessage } from '../services/api/client';
import { CreateProductRequest, Product, ProductListResult, UpdateProductRequest } from '../types/Product';

const initialList: ProductListResult = {
  items: [],
  pageNumber: 1,
  pageSize: 10,
};

export function useProducts(pageSize = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(
    async (nextPage = pageNumber) => {
      setLoading(true);
      setError(null);

      try {
        const result = await ProductService.list({
          pageNumber: nextPage,
          pageSize,
        });

        setProducts(result.items);
        setPageNumber(result.pageNumber);
        setTotalPages(result.totalPages);
      } catch (err) {
        setProducts(initialList.items);
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [pageNumber, pageSize],
  );

  const createProduct = useCallback(
    async (data: CreateProductRequest) => {
      setSaving(true);
      setError(null);

      try {
        await ProductService.create(data);
        await loadProducts(1);
      } catch (err: any) {
        console.log('[createProduct] Error response:', err?.response?.status, JSON.stringify(err?.response?.data, null, 2));
        const message = getApiErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [loadProducts],
  );

  const updateProduct = useCallback(
    async (id: string, data: UpdateProductRequest) => {
      setSaving(true);
      setError(null);

      try {
        await ProductService.update(id, data);
        await loadProducts(pageNumber);
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [loadProducts, pageNumber],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      setDeletingId(id);
      setError(null);

      try {
        await ProductService.remove(id);
        await loadProducts(pageNumber);
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setDeletingId(null);
      }
    },
    [loadProducts, pageNumber],
  );

  useEffect(() => {
    void loadProducts(1);
  }, []);

  return {
    products,
    pageNumber,
    pageSize,
    totalPages,
    loading,
    saving,
    deletingId,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
