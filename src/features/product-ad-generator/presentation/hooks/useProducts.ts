import { useCallback, useEffect, useState } from 'react';
import { ApiProductRepository } from '../../infrastructure/repositories/ApiProductRepository';
import { ListProductsUseCase } from '../../application/use-cases/ListProductsUseCase';
import { CreateProductUseCase } from '../../application/use-cases/CreateProductUseCase';
import { UpdateProductUseCase } from '../../application/use-cases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../application/use-cases/DeleteProductUseCase';
import { GenerateAdUseCase } from '../../application/use-cases/GenerateAdUseCase';
import { getApiErrorMessage } from '../../../../core/infrastructure/api/client';
import {
  CreateProductRequest,
  GenerateProductAdResponse,
  Product,
  ProductListResult,
  UpdateProductRequest,
} from '../../domain/models/Product';

const initialList: ProductListResult = {
  items: [],
  pageNumber: 1,
  pageSize: 10,
};

const productRepository = new ApiProductRepository();
const listProductsUseCase = new ListProductsUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);
const generateAdUseCase = new GenerateAdUseCase(productRepository);

export function useProducts(pageSize = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingAd, setGeneratingAd] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(
    async (nextPage = pageNumber) => {
      setLoading(true);
      setError(null);

      try {
        const result = await listProductsUseCase.execute({
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
        await createProductUseCase.execute(data);
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
        await updateProductUseCase.execute(id, data);
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
        await deleteProductUseCase.execute(id);
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

  const generateAd = useCallback(
    async (productIds: string[]): Promise<GenerateProductAdResponse> => {
      setGeneratingAd(true);
      setError(null);

      try {
        const response = await generateAdUseCase.execute(productIds);
        await loadProducts(pageNumber);
        return response;
      } catch (err) {
        const message = getApiErrorMessage(err);
        throw new Error(message);
      } finally {
        setGeneratingAd(false);
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
    generatingAd,
    deletingId,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    generateAd,
  };
}
