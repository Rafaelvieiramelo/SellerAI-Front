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
import { useProducts } from '../presentation/hooks/useProducts';
import { Product, productFormToCreateRequest } from '../domain/models/Product';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radii } from '../../../theme/radii';
import { shadows } from '../../../theme/shadows';

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
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
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
        onShowDetails={setDetailsProduct}
      />
    </>
  );

  return (
    <LinearGradient colors={[colors.bgPrimary, colors.bgInput, colors.bgSurface]} style={styles.container}>
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
      <ProductDetailsModal product={detailsProduct} onClose={() => setDetailsProduct(null)} />
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
  onShowDetails,
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
  onShowDetails: (product: Product) => void;
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
          const isAiGenerated = getGeneratedProductFields(product).isGeneratedByAI;

          return (
            <View key={product.id} style={[styles.productCard, selected && styles.productCardSelected]}>
              <View style={styles.productCardHeader}>
                <Pressable
                  onPress={() => {
                    if (!isAiGenerated) {
                      onToggleProduct(product.id);
                    }
                  }}
                  disabled={isAiGenerated}
                  style={({ pressed }) => [
                    styles.checkbox,
                    selected && styles.checkboxSelected,
                    isAiGenerated && styles.checkboxDisabled,
                    pressed && !isAiGenerated && styles.pressed,
                  ]}
                >
                  <Text style={styles.checkboxText}>{isAiGenerated ? 'IA' : selected ? 'OK' : ''}</Text>
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

              <View style={styles.actions}>
                {isAiGenerated ? (
                  <Pressable
                    onPress={() => onShowDetails(product)}
                    style={({ pressed }) => [styles.detailsButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.detailsButtonText}>Detalhes</Text>
                  </Pressable>
                ) : null}
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
        <Text style={styles.generatedHeading}>Anúncio Gerado por Inteligência Artificial</Text>
      </View>

      {generated.titulo ? <GeneratedField label="Título Sugerido" value={generated.titulo} /> : null}
      {generated.descricao ? <GeneratedField label="Descrição Sugerida" value={generated.descricao} /> : null}
      {generated.cta ? <GeneratedField label="Chamada para Ação (CTA)" value={generated.cta} /> : null}

      {generated.tags.length ? <GeneratedChips label="Tags Sugeridas" values={generated.tags} /> : null}
      {generated.caracteristicasDestaque.length ? (
        <GeneratedChips label="Destaques Recomendados" values={generated.caracteristicasDestaque} />
      ) : null}

      {generated.createdAt ? <Text style={styles.generatedDate}>Criado em {formatDate(generated.createdAt)}</Text> : null}
    </View>
  );
}

function ProductDetailsModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  if (!product) {
    return null;
  }

  const generated = getGeneratedProductFields(product);

  return (
    <Modal visible={Boolean(product)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalContent, styles.detailsModalContent]}>
          <View style={styles.detailsModalHeader}>
            <View style={styles.generatedHeader}>
              <Text style={styles.generatedBadge}>IA</Text>
              <Text style={styles.detailsModalTitle} numberOfLines={1}>
                {product.name}
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.detailsModalScroll}
            contentContainerStyle={styles.detailsModalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {generated.titulo ? <GeneratedField label="Título Sugerido" value={generated.titulo} /> : null}
            {generated.descricao ? <GeneratedField label="Descrição Sugerida" value={generated.descricao} /> : null}
            {generated.cta ? <GeneratedField label="Chamada para Ação (CTA)" value={generated.cta} /> : null}

            {generated.tags.length ? <GeneratedChips label="Tags Sugeridas" values={generated.tags} /> : null}
            {generated.caracteristicasDestaque.length ? (
              <GeneratedChips label="Destaques Recomendados" values={generated.caracteristicasDestaque} />
            ) : null}

            <View style={styles.detailsModalDivider} />

            <View style={styles.detailsModalFieldRow}>
              <View style={styles.detailsModalHalfField}>
                <Text style={styles.generatedLabel}>Categoria</Text>
                <Text style={styles.generatedValue}>{product.category || 'N/A'}</Text>
              </View>
              <View style={styles.detailsModalHalfField}>
                <Text style={styles.generatedLabel}>Marketplace</Text>
                <Text style={styles.generatedValue}>{product.marketplace || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.detailsModalFieldRow}>
              <View style={styles.detailsModalHalfField}>
                <Text style={styles.generatedLabel}>Público-Alvo</Text>
                <Text style={styles.generatedValue}>{product.targetAudience || 'N/A'}</Text>
              </View>
              <View style={styles.detailsModalHalfField}>
                <Text style={styles.generatedLabel}>Tom de Voz</Text>
                <Text style={styles.generatedValue}>{product.tone || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.detailsModalFieldRow}>
              <View style={styles.detailsModalHalfField}>
                <Text style={styles.generatedLabel}>Preço</Text>
                <Text style={styles.generatedValue}>{formatPrice(product.price)}</Text>
              </View>
              {generated.createdAt ? (
                <View style={styles.detailsModalHalfField}>
                  <Text style={styles.generatedLabel}>Criado em</Text>
                  <Text style={styles.generatedValue}>{formatDate(generated.createdAt)}</Text>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <Pressable onPress={onClose} style={({ pressed }) => [styles.detailsCloseButton, pressed && styles.pressed]}>
            <Text style={styles.detailsCloseButtonText}>Fechar Detalhes</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
    backgroundColor: colors.bgPrimary,
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
    paddingHorizontal: spacing[4] + 2,
    paddingTop: spacing[12] + spacing[2],
    paddingBottom: spacing[12],
  },
  webContent: {
    flexGrow: 0,
    minHeight: '100%',
  },
  hero: {
    marginBottom: spacing[5] + 2,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    borderRadius: radii.full,
    backgroundColor: colors.brandSubtle,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    marginBottom: spacing[3] + 2,
  },
  heroBadgeText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    ...typography.body,
    color: colors.textTertiary,
    lineHeight: 22,
    marginTop: spacing[2],
    maxWidth: 520,
    fontWeight: '600',
  },
  errorPanel: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radii.xl + 2,
    backgroundColor: colors.errorSubtle,
    padding: spacing[3] + 2,
    marginBottom: spacing[3] + 2,
  },
  errorTitle: {
    ...typography.bodySm,
    color: colors.errorText,
    fontWeight: '900',
  },
  errorText: {
    ...typography.bodySm,
    color: colors.errorText,
    lineHeight: 19,
    marginTop: spacing[1],
    fontWeight: '700',
  },
  listSection: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgSurface,
    padding: spacing[4] + 2,
    ...shadows.sm,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  eyebrow: {
    ...typography.overline,
    color: colors.brandText,
    fontWeight: '900',
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '900',
    marginTop: spacing[1],
  },
  refreshButton: {
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    borderRadius: radii.xl,
    paddingHorizontal: spacing[3],
  },
  refreshButtonText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '900',
  },
  bulkActions: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgSurface,
    padding: spacing[2] + 2,
    marginBottom: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  selectionText: {
    flex: 1,
    minWidth: 0,
    ...typography.bodySm,
    color: colors.textSecondary,
    lineHeight: 18,
    fontWeight: '800',
  },
  generateAdButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    backgroundColor: colors.brandHover,
    paddingHorizontal: spacing[3],
  },
  generateAdButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  emptyText: {
    ...typography.bodySm,
    color: colors.textTertiary,
    fontWeight: '700',
  },
  productList: {
    gap: spacing[3],
  },
  productCard: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl + 2,
    backgroundColor: colors.bgSurface,
    padding: spacing[3] + 2,
    gap: spacing[3],
  },
  productCardSelected: {
    borderColor: colors.brandText,
    backgroundColor: colors.brandSubtle,
  },
  productCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl,
    backgroundColor: colors.bgInput,
  },
  checkboxSelected: {
    borderColor: colors.brandText,
    backgroundColor: colors.brandPrimary,
  },
  checkboxText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  productMeta: {
    ...typography.caption,
    color: colors.textTertiary,
    lineHeight: 18,
    marginTop: spacing[1],
    fontWeight: '700',
  },
  productPrice: {
    ...typography.body,
    color: colors.brandText,
    fontWeight: '900',
  },
  productFeatures: {
    ...typography.bodySm,
    color: colors.textSecondary,
    lineHeight: 19,
    fontWeight: '700',
  },
  generatedDetails: {
    borderWidth: 1,
    borderColor: colors.brandActive,
    borderRadius: radii['2xl'],
    backgroundColor: colors.brandSubtle,
    padding: spacing[3],
    gap: spacing[2] + 2,
  },
  generatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  generatedBadge: {
    overflow: 'hidden',
    borderRadius: radii.lg,
    backgroundColor: colors.brandHover,
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[1],
  },
  generatedHeading: {
    ...typography.bodySm,
    color: colors.brandText,
    fontWeight: '900',
  },
  generatedField: {
    gap: spacing[1],
  },
  generatedLabel: {
    ...typography.overline,
    color: colors.brandText,
    fontWeight: '900',
  },
  generatedValue: {
    ...typography.bodySm,
    color: colors.textPrimary,
    lineHeight: 19,
    fontWeight: '700',
  },
  generatedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  generatedChip: {
    borderWidth: 1,
    borderColor: colors.brandHover,
    borderRadius: radii.full,
    backgroundColor: colors.brandSubtle,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  generatedChipText: {
    ...typography.overline,
    color: colors.brandText,
    fontWeight: '800',
  },
  generatedDate: {
    ...typography.overline,
    color: colors.textTertiary,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2] + 2,
  },
  actionButton: {
    minHeight: 42,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    backgroundColor: colors.successSubtle,
  },
  actionButtonText: {
    ...typography.bodySm,
    color: colors.successText,
    fontWeight: '900',
  },
  deleteButton: {
    minHeight: 42,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    backgroundColor: colors.errorSubtle,
  },
  deleteButtonText: {
    ...typography.bodySm,
    color: colors.errorText,
    fontWeight: '900',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2] + 2,
    marginTop: spacing[4],
  },
  pageButton: {
    minHeight: 42,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl,
    paddingHorizontal: spacing[3],
  },
  pageButtonText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    fontWeight: '900',
  },
  disabledButton: {
    opacity: 0.35,
  },
  pageLabel: {
    ...typography.bodySm,
    color: colors.textTertiary,
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
    backgroundColor: colors.bgOverlay,
    padding: spacing[5],
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radii['2xl'],
    backgroundColor: colors.errorSubtle,
    padding: spacing[4] + 2,
    gap: spacing[3],
  },
  modalTitle: {
    ...typography.h3,
    color: colors.errorText,
    fontWeight: '900',
  },
  modalText: {
    ...typography.body,
    color: colors.errorText,
    lineHeight: 20,
    fontWeight: '700',
  },
  modalButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    backgroundColor: colors.error,
    paddingHorizontal: spacing[3] + 2,
  },
  modalButtonText: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '900',
  },
  checkboxDisabled: {
    borderColor: colors.borderDefault,
    backgroundColor: colors.borderDefault,
    opacity: 0.5,
  },
  detailsButton: {
    minHeight: 42,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    backgroundColor: colors.brandSubtle,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
  },
  detailsButtonText: {
    ...typography.bodySm,
    color: colors.brandText,
    fontWeight: '900',
  },
  detailsModalContent: {
    maxWidth: 520,
    maxHeight: '80%',
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    padding: spacing[5],
  },
  detailsModalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    paddingBottom: spacing[3],
    marginBottom: spacing[3],
  },
  detailsModalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '900',
    flex: 1,
  },
  detailsModalScroll: {
    flex: 1,
  },
  detailsModalScrollContent: {
    gap: spacing[4],
    paddingBottom: spacing[2],
  },
  detailsModalDivider: {
    height: 1,
    backgroundColor: colors.borderDefault,
    marginVertical: spacing[2],
  },
  detailsModalFieldRow: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  detailsModalHalfField: {
    flex: 1,
    gap: spacing[1],
  },
  detailsCloseButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing[4],
    marginTop: spacing[2],
  },
  detailsCloseButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
  },
});
