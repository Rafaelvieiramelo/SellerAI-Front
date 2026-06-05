import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
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

const firstAllowedValue = <T extends readonly string[]>(value: string | null | undefined, allowed: T, fallback: T[number]) =>
  allowed.includes(value ?? '') ? (value as T[number]) : fallback;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

const formatDate = (value?: string) => {
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

const readString = (product: Product, camelKey: keyof Product, pascalKey: string) => {
  const fallbackValue = (product as unknown as Record<string, unknown>)[pascalKey];
  const value = product[camelKey] ?? fallbackValue;
  return typeof value === 'string' ? value : '';
};

const readStringList = (product: Product, camelKey: keyof Product, pascalKey: string) => {
  const fallbackValue = (product as unknown as Record<string, unknown>)[pascalKey];
  const value = product[camelKey] ?? fallbackValue;
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
};

const readBoolean = (product: Product, camelKey: keyof Product, pascalKey: string) => {
  const fallbackValue = (product as unknown as Record<string, unknown>)[pascalKey];
  const value = product[camelKey] ?? fallbackValue;
  return typeof value === 'boolean' ? value : false;
};

const getGeneratedProductFields = (product: Product) => ({
  titulo: readString(product, 'generatedTitulo', 'GeneratedTitulo'),
  descricao: readString(product, 'generatedDescricao', 'GeneratedDescricao'),
  tags: readStringList(product, 'generatedTags', 'GeneratedTags'),
  caracteristicasDestaque: readStringList(
    product,
    'generatedCaracteristicasDestaque',
    'GeneratedCaracteristicasDestaque',
  ),
  cta: readString(product, 'generatedCta', 'GeneratedCta'),
  isGeneratedByAI: readBoolean(product, 'isGeneratedByAI', 'IsGeneratedByAI'),
  createdAt: readString(product, 'createdAt', 'CreatedAt'),
});

const hasGeneratedContent = (product: Product) => {
  const generated = getGeneratedProductFields(product);

  return Boolean(
    generated.isGeneratedByAI ||
      generated.titulo ||
      generated.descricao ||
      generated.tags.length ||
      generated.caracteristicasDestaque.length ||
      generated.cta,
  );
};

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
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const {
    products,
    pageNumber,
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

  useEffect(() => {
    const visibleProductIds = new Set(products.map((product) => product.id));
    setSelectedProductIds((currentIds) => currentIds.filter((id) => visibleProductIds.has(id)));
  }, [products]);

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

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds((currentIds) =>
      currentIds.includes(id) ? currentIds.filter((selectedId) => selectedId !== id) : [...currentIds, id],
    );
  };

  const handleGenerateAd = async () => {
    if (!selectedProductIds.length || generatingAd) {
      return;
    }

    try {
      await generateAd(selectedProductIds);
      setSelectedProductIds([]);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Nao foi possivel gerar o anuncio com IA.');
    }
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
        submitLabel="Salvar Produto"
        watchedCostPrice={watch('costPrice')}
        watchedSalePrice={watch('salePrice')}
      />

      <ProductList
        products={products}
        loading={loading}
        generatingAd={generatingAd}
        deletingId={deletingId}
        pageNumber={pageNumber}
        selectedProductIds={selectedProductIds}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onRefresh={() => loadProducts(pageNumber)}
        onPrevious={() => loadProducts(pageNumber - 1)}
        onNext={() => loadProducts(pageNumber + 1)}
        onToggleProduct={handleToggleProduct}
        onGenerateAd={handleGenerateAd}
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
      <LoadingOverlay visible={saving || generatingAd} />
      <ErrorModal message={generationError} onClose={() => setGenerationError(null)} />
    </LinearGradient>
  );
}

function ProductList({
  products,
  loading,
  generatingAd,
  deletingId,
  pageNumber,
  selectedProductIds,
  canGoBack,
  canGoForward,
  onRefresh,
  onPrevious,
  onNext,
  onToggleProduct,
  onGenerateAd,
  onEdit,
  onDelete,
}: {
  products: Product[];
  loading: boolean;
  generatingAd: boolean;
  deletingId: string | null;
  pageNumber: number;
  selectedProductIds: string[];
  canGoBack: boolean;
  canGoForward: boolean;
  onRefresh: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleProduct: (id: string) => void;
  onGenerateAd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  const selectedCount = selectedProductIds.length;
  const canGenerateAd = selectedCount > 0 && !generatingAd;

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

      <View style={styles.bulkActions}>
        <Text style={styles.selectionText}>
          {selectedCount ? `${selectedCount} produto${selectedCount > 1 ? 's' : ''} selecionado${selectedCount > 1 ? 's' : ''}` : 'Selecione produtos para gerar anúncios'}
        </Text>
        <Pressable
          onPress={onGenerateAd}
          disabled={!canGenerateAd}
          style={({ pressed }) => [styles.generateAdButton, (!canGenerateAd || loading) && styles.disabledButton, pressed && styles.pressed]}
        >
          <Text style={styles.generateAdButtonText}>{generatingAd ? 'Gerando...' : 'Gerar Anuncio com IA'}</Text>
        </Pressable>
      </View>

      {loading && products.length === 0 ? <Text style={styles.emptyText}>Buscando produtos...</Text> : null}

      {!loading && products.length === 0 ? <Text style={styles.emptyText}>Nenhum produto cadastrado ainda.</Text> : null}

      <View style={styles.productList}>
        {products.map((product) => {
          const selected = selectedProductIds.includes(product.id);

          return (
            <View key={product.id} style={[styles.productCard, selected && styles.productCardSelected]}>
              <View style={styles.productCardHeader}>
                <Pressable
                  onPress={() => onToggleProduct(product.id)}
                  style={({ pressed }) => [styles.checkbox, selected && styles.checkboxSelected, pressed && styles.pressed]}
                >
                  <Text style={styles.checkboxText}>{selected ? 'OK' : ''}</Text>
                </Pressable>
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

              {hasGeneratedContent(product) ? <GeneratedAdDetails product={product} /> : null}

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
          );
        })}
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

function GeneratedAdDetails({ product }: { product: Product }) {
  const generated = getGeneratedProductFields(product);

  return (
    <View style={styles.generatedDetails}>
      <View style={styles.generatedHeader}>
        <Text style={styles.generatedBadge}>IA</Text>
        <Text style={styles.generatedHeading}>Anuncio gerado</Text>
      </View>

      {generated.titulo ? <GeneratedField label="Titulo" value={generated.titulo} /> : null}
      {generated.descricao ? <GeneratedField label="Descricao" value={generated.descricao} /> : null}
      {generated.cta ? <GeneratedField label="CTA" value={generated.cta} /> : null}

      {generated.tags.length ? <GeneratedChips label="Tags" values={generated.tags} /> : null}
      {generated.caracteristicasDestaque.length ? (
        <GeneratedChips label="Destaques" values={generated.caracteristicasDestaque} />
      ) : null}

      {generated.createdAt ? <Text style={styles.generatedDate}>Criado em {formatDate(generated.createdAt)}</Text> : null}
    </View>
  );
}

function GeneratedField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.generatedField}>
      <Text style={styles.generatedLabel}>{label}</Text>
      <Text style={styles.generatedValue}>{value}</Text>
    </View>
  );
}

function GeneratedChips({ label, values }: { label: string; values: string[] }) {
  return (
    <View style={styles.generatedField}>
      <Text style={styles.generatedLabel}>{label}</Text>
      <View style={styles.generatedChips}>
        {values.map((value) => (
          <View key={value} style={styles.generatedChip}>
            <Text style={styles.generatedChipText}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ErrorModal({ message, onClose }: { message: string | null; onClose: () => void }) {
  return (
    <Modal visible={Boolean(message)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nao foi possivel gerar o anuncio</Text>
          <Text style={styles.modalText}>{message}</Text>
          <Pressable onPress={onClose} style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
  bulkActions: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#22364d',
    borderRadius: 16,
    backgroundColor: '#0d1b2c',
    padding: 10,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectionText: {
    flex: 1,
    minWidth: 0,
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  generateAdButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
  },
  generateAdButtonText: {
    color: '#ffffff',
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
  productCardSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#10243a',
  },
  productCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    backgroundColor: '#0f172a',
  },
  checkboxSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#0ea5e9',
  },
  checkboxText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
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
  generatedDetails: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 16,
    backgroundColor: '#081f35',
    padding: 12,
    gap: 10,
  },
  generatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  generatedBadge: {
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  generatedHeading: {
    color: '#dbeafe',
    fontSize: 13,
    fontWeight: '900',
  },
  generatedField: {
    gap: 5,
  },
  generatedLabel: {
    color: '#7dd3fc',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  generatedValue: {
    color: '#f8fafc',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  generatedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  generatedChip: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 999,
    backgroundColor: '#0f2b46',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  generatedChipText: {
    color: '#dbeafe',
    fontSize: 11,
    fontWeight: '800',
  },
  generatedDate: {
    color: '#94a3b8',
    fontSize: 11,
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
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.74)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: '#7f1d1d',
    borderRadius: 20,
    backgroundColor: '#1f1117',
    padding: 18,
    gap: 12,
  },
  modalTitle: {
    color: '#fecdd3',
    fontSize: 17,
    fontWeight: '900',
  },
  modalText: {
    color: '#fecaca',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  modalButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#be123c',
    paddingHorizontal: 14,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
});
