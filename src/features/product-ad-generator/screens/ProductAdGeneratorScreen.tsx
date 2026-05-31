import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { productAdSchema } from '../application/productAdSchema';
import {
  audiences,
  categories,
  marketplaces,
  ProductAdFormData,
  tones,
} from '../domain/productAdTypes';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ProductForm } from '../components/ProductForm';
import { useProducts } from '../../../hooks/useProducts';
import { Product, productFormToCreateRequest } from '../../../types/Product';

const defaultValues: ProductAdFormData = {
  productName: '',
  category: 'EletrÃ´nicos',
  marketplace: 'Shopee',
  features: ['Bluetooth 5.3', 'RGB', 'Baixa LatÃªncia'],
  audience: 'Gamer',
  costPrice: '',
  salePrice: '',
  targetMargin: '30',
  tone: 'Persuasivo',
  imageUri: undefined,
};

const firstAllowedValue = <T extends readonly string[]>(value: string | null | undefined, allowed: T, fallback: T[number]) =>
  allowed.includes(value ?? '') ? (value as T[number]) : fallback;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

const productToFormData = (product: Product): ProductAdFormData => ({
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

export default function ProductAdGeneratorScreen() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const {
    products,
    pageNumber,
    totalPages,
    loading,
    saving,
    deletingId,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts(10);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductAdFormData>({
    resolver: zodResolver(productAdSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const isEditing = Boolean(editingProduct);
  const busy = saving;

  const onSubmit = async (data: ProductAdFormData) => {
    const payload = productFormToCreateRequest(data);
    console.log('[ProductAdGenerator] Form data:', JSON.stringify(data, null, 2));
    console.log('[ProductAdGenerator] Payload:', JSON.stringify(payload, null, 2));

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        id: editingProduct.id,
        ...payload,
      });
    } else {
      await createProduct(payload);
    }

    setEditingProduct(null);
    reset(defaultValues);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    reset(productToFormData(product));
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    reset(defaultValues);
  };

  const canGoBack = pageNumber > 1;
  const canGoForward = useMemo(() => (totalPages ? pageNumber < totalPages : products.length === 10), [pageNumber, products.length, totalPages]);

  const screenContent = (
    <>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>SellerAI Products</Text>
        </View>
        <Text style={styles.title}>{isEditing ? 'Editar Produto' : 'Novo Produto'}</Text>
        <Text style={styles.subtitle}>Cadastre, atualize e acompanhe seus produtos usando a API REST.</Text>
      </View>

      {error ? (
        <View style={styles.errorPanel}>
          <Text style={styles.errorTitle}>Erro na API</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <ProductForm
        control={control}
        errors={errors}
        loading={busy}
        onSubmit={handleSubmit(onSubmit)}
        onCancelEdit={isEditing ? handleCancelEdit : undefined}
        submitLabel={isEditing ? 'Salvar alteracoes' : 'Cadastrar produto'}
        watchedCostPrice={watch('costPrice')}
        watchedSalePrice={watch('salePrice')}
      />

      <ProductList
        products={products}
        loading={loading}
        deletingId={deletingId}
        pageNumber={pageNumber}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onRefresh={() => loadProducts(pageNumber)}
        onPrevious={() => loadProducts(pageNumber - 1)}
        onNext={() => loadProducts(pageNumber + 1)}
        onEdit={handleEdit}
        onDelete={deleteProduct}
      />
    </>
  );

  return (
    <LinearGradient colors={['#07111f', '#0f172a', '#111827']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: 'height', default: undefined })}
        enabled={Platform.OS !== 'web'}
        style={styles.flex}
      >
        {Platform.OS === 'web' ? (
          <View style={[styles.content, styles.webContent]}>{screenContent}</View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            nestedScrollEnabled
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {screenContent}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
      <LoadingOverlay visible={saving} />
    </LinearGradient>
  );
}

function ProductList({
  products,
  loading,
  deletingId,
  pageNumber,
  canGoBack,
  canGoForward,
  onRefresh,
  onPrevious,
  onNext,
  onEdit,
  onDelete,
}: {
  products: Product[];
  loading: boolean;
  deletingId: string | null;
  pageNumber: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onRefresh: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.listSection}>
      <View style={styles.listHeader}>
        <View>
          <Text style={styles.eyebrow}>Produtos cadastrados</Text>
          <Text style={styles.sectionTitle}>Lista de produtos</Text>
        </View>
        <Pressable onPress={onRefresh} disabled={loading} style={({ pressed }) => [styles.refreshButton, pressed && styles.pressed]}>
          <Text style={styles.refreshButtonText}>{loading ? 'Carregando' : 'Atualizar'}</Text>
        </Pressable>
      </View>

      {loading && products.length === 0 ? <Text style={styles.emptyText}>Buscando produtos...</Text> : null}

      {!loading && products.length === 0 ? <Text style={styles.emptyText}>Nenhum produto cadastrado ainda.</Text> : null}

      <View style={styles.productList}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productCardHeader}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  {[product.category, product.marketplace, product.targetAudience].filter(Boolean).join(' | ')}
                </Text>
              </View>
              <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
            </View>

            {product.features?.length ? (
              <Text style={styles.productFeatures}>{product.features.slice(0, 4).join(', ')}</Text>
            ) : null}

            <View style={styles.actions}>
              <Pressable onPress={() => onEdit(product)} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                <Text style={styles.actionButtonText}>Editar</Text>
              </Pressable>
              <Pressable
                onPress={() => onDelete(product.id)}
                disabled={deletingId === product.id}
                style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
              >
                <Text style={styles.deleteButtonText}>{deletingId === product.id ? 'Excluindo' : 'Excluir'}</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.pagination}>
        <Pressable disabled={!canGoBack || loading} onPress={onPrevious} style={[styles.pageButton, (!canGoBack || loading) && styles.disabledButton]}>
          <Text style={styles.pageButtonText}>Anterior</Text>
        </Pressable>
        <Text style={styles.pageLabel}>Pagina {pageNumber}</Text>
        <Pressable disabled={!canGoForward || loading} onPress={onNext} style={[styles.pageButton, (!canGoForward || loading) && styles.disabledButton]}>
          <Text style={styles.pageButtonText}>Proxima</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#07111f',
    ...Platform.select({
      web: {
        flex: 0,
        minHeight: '100%',
      },
      default: null,
    }),
  },
  flex: {
    flex: 1,
    minHeight: 0,
    ...Platform.select({
      web: {
        flex: 0,
        minHeight: '100%',
      },
      default: null,
    }),
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 48,
  },
  webContent: {
    flexGrow: 0,
    minHeight: '100%',
  },
  hero: {
    marginBottom: 22,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#1d9bf0',
    borderRadius: 999,
    backgroundColor: '#10243a',
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: '#7dd3fc',
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 520,
    fontWeight: '600',
  },
  errorPanel: {
    borderWidth: 1,
    borderColor: '#7f1d1d',
    borderRadius: 18,
    backgroundColor: '#2a1118',
    padding: 14,
    marginBottom: 14,
  },
  errorTitle: {
    color: '#fecdd3',
    fontSize: 13,
    fontWeight: '900',
  },
  errorText: {
    color: '#fb7185',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    fontWeight: '700',
  },
  listSection: {
    borderWidth: 1,
    borderColor: '#1f2d3f',
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    padding: 18,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  eyebrow: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 4,
  },
  refreshButton: {
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1d9bf0',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  refreshButtonText: {
    color: '#bae6fd',
    fontSize: 12,
    fontWeight: '900',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  productList: {
    gap: 12,
  },
  productCard: {
    borderWidth: 1,
    borderColor: '#22364d',
    borderRadius: 18,
    backgroundColor: '#0d1b2c',
    padding: 14,
    gap: 12,
  },
  productCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900',
  },
  productMeta: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    fontWeight: '700',
  },
  productPrice: {
    color: '#7dd3fc',
    fontSize: 15,
    fontWeight: '900',
  },
  productFeatures: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    minHeight: 42,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#123524',
  },
  actionButtonText: {
    color: '#bbf7d0',
    fontSize: 13,
    fontWeight: '900',
  },
  deleteButton: {
    minHeight: 42,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#3f1d2a',
  },
  deleteButtonText: {
    color: '#fecdd3',
    fontSize: 13,
    fontWeight: '900',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
  },
  pageButton: {
    minHeight: 42,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  pageButtonText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '900',
  },
  disabledButton: {
    opacity: 0.35,
  },
  pageLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '800',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
