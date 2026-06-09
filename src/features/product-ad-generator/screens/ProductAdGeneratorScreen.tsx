import React, { useEffect, useMemo, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
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
import {
  PrimaryButton,
  SecondaryButton,
  AIButton,
  StatsCard,
  ProductCard,
  SearchBar,
  FilterSelect,
  EmptyState,
  LoadingState,
  PageHeader
} from '../../../components';

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(480));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMarketplace, setFilterMarketplace] = useState<'Todos' | 'Shopee' | 'Mercado Livre' | 'Amazon' | 'Outros'>('Todos');
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Anunciados' | 'Pendentes'>('Todos');
  const [sortBy, setSortBy] = useState<'Recentes' | 'Nome' | 'PrecoCrescente' | 'PrecoDecrescente'>('Recentes');
  const { width } = useWindowDimensions();

  const {
    products,
    pageNumber,
    totalPages,
    totalCount,
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

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Name Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.marketplace?.toLowerCase().includes(query)
      );
    }

    // 2. Marketplace Filter
    if (filterMarketplace !== 'Todos') {
      list = list.filter((p) => {
        const pMkt = p.marketplace?.toLowerCase() || '';
        if (filterMarketplace === 'Mercado Livre') return pMkt.includes('mercado') || pMkt.includes('livre') || pMkt === 'ml';
        if (filterMarketplace === 'Shopee') return pMkt.includes('shopee');
        if (filterMarketplace === 'Amazon') return pMkt.includes('amazon');
        return !pMkt.includes('mercado') && !pMkt.includes('livre') && pMkt !== 'ml' && !pMkt.includes('shopee') && !pMkt.includes('amazon');
      });
    }

    // 3. Status Filter
    if (filterStatus !== 'Todos') {
      list = list.filter((p) => {
        const isAnnounced = getGeneratedProductFields(p).isGeneratedByAI;
        return filterStatus === 'Anunciados' ? isAnnounced : !isAnnounced;
      });
    }

    // 4. Sorting
    list.sort((a, b) => {
      if (sortBy === 'Nome') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'PrecoCrescente') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'PrecoDecrescente') {
        return (b.price || 0) - (a.price || 0);
      }
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return list;
  }, [products, searchQuery, filterMarketplace, filterStatus, sortBy]);

  const metrics = useMemo(() => {
    const total = products.length;
    const announced = products.filter(p => getGeneratedProductFields(p).isGeneratedByAI).length;
    const pending = total - announced;
    return { total, announced, pending };
  }, [products]);

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

  useEffect(() => {
    if (isFormOpen && Platform.OS === 'web') {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 480,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isFormOpen]);

  const onSubmit = async (data: ProductAdFormData) => {
    const payload = productFormToCreateRequest(data);

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
    setIsFormOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    reset(productToFormData(product));
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    reset(defaultValues);
    setIsFormOpen(false);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    reset(defaultValues);
    setIsFormOpen(true);
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

  const renderForm = () => (
    <ProductForm
      control={control}
      errors={errors}
      loading={busy}
      onSubmit={handleSubmit(onSubmit)}
      onCancelEdit={handleCancelEdit}
      submitLabel="Salvar Produto"
      watchedCostPrice={watch('costPrice')}
      watchedSalePrice={watch('salePrice')}
    />
  );

  const screenContent = (
    <>
      <PageHeader
        title="Meus Produtos"
        subtitle="Gerencie e acompanhe seus anúncios dos marketplaces de forma centralizada."
        badgeText="SellerAI Products"
        action={
          Platform.OS === 'web' && (
            <PrimaryButton title="+ Novo Produto" onPress={handleNewProduct} />
          )
        }
      />

      {/* Metrics Cards Bar */}
      <View style={[
        styles.metricsContainer,
        {
          flexDirection: width >= 640 ? 'row' : 'column',
          gap: spacing[4],
        }
      ]}>
        <StatsCard label="Total de Produtos" value={metrics.total} icon="📦" type="total" />
        <StatsCard label="Produtos Anunciados" value={metrics.announced} icon="✨" type="announced" />
        <StatsCard label="Produtos Pendentes" value={metrics.pending} icon="⏳" type="pending" />
      </View>

      {error ? (
        <View style={styles.errorPanel}>
          <Text style={styles.errorTitle}>Erro na API</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <ProductList
        products={filteredProducts}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        filterMarketplace={filterMarketplace}
        onFilterMarketplaceChange={setFilterMarketplace}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={totalCount}
        totalPages={totalPages}
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
        onPageSelect={(page) => loadProducts(page)}
        onToggleProduct={handleToggleProduct}
        onGenerateAd={handleGenerateAd}
        onEdit={handleEdit}
        onDelete={deleteProduct}
        onShowDetails={setDetailsProduct}
        onNewProduct={handleNewProduct}
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

      {Platform.OS !== 'web' && (
        <Pressable
          onPress={handleNewProduct}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}

      {Platform.OS === 'web' && isFormOpen && (
        <View style={styles.drawerBackdrop}>
          <Pressable style={styles.backdropClickArea} onPress={handleCancelEdit} />
          <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</Text>
              <Pressable onPress={handleCancelEdit} style={styles.closeDrawerButton}>
                <Text style={styles.closeDrawerText}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
              {renderForm()}
            </ScrollView>
          </Animated.View>
        </View>
      )}

      {Platform.OS !== 'web' && (
        <Modal
          visible={isFormOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCancelEdit}
        >
          <View style={styles.bottomSheetBackdrop}>
            <Pressable style={styles.backdropClickArea} onPress={handleCancelEdit} />
            <View style={styles.bottomSheetContent}>
              <View style={styles.bottomSheetDragHandle} />
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</Text>
                <Pressable onPress={handleCancelEdit} style={styles.closeDrawerButton}>
                  <Text style={styles.closeDrawerText}>✕</Text>
                </Pressable>
              </View>
              <ScrollView
                style={styles.bottomSheetScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {renderForm()}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      <LoadingOverlay visible={saving || generatingAd} />
      <ErrorModal message={generationError} onClose={() => setGenerationError(null)} />
      <ProductDetailsModal product={detailsProduct} onClose={() => setDetailsProduct(null)} />
    </LinearGradient>
  );
}

function ProductList({
  products,
  searchQuery,
  onSearchQueryChange,
  filterMarketplace,
  onFilterMarketplaceChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortByChange,
  totalCount,
  totalPages,
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
  onPageSelect,
  onToggleProduct,
  onGenerateAd,
  onEdit,
  onDelete,
  onShowDetails,
  onNewProduct,
}: {
  products: Product[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  filterMarketplace: string;
  onFilterMarketplaceChange: (val: any) => void;
  filterStatus: string;
  onFilterStatusChange: (val: any) => void;
  sortBy: string;
  onSortByChange: (val: any) => void;
  totalCount?: number;
  totalPages?: number;
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
  onPageSelect: (page: number) => void;
  onToggleProduct: (id: string) => void;
  onGenerateAd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onShowDetails: (product: Product) => void;
  onNewProduct: () => void;
}) {
  const selectedCount = selectedProductIds.length;
  const canGenerateAd = selectedCount > 0 && !generatingAd;
  const { width } = useWindowDimensions();

  const columns = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
  const cardWidth = columns === 3 ? '31.5%' : columns === 2 ? '48.5%' : '100%';

  return (
    <View style={styles.listSection}>
      <View style={styles.listHeader}>
        <View>
          <Text style={styles.sectionTitle}>Produtos cadastrados</Text>
        </View>
        <Pressable onPress={onRefresh} disabled={loading} style={({ pressed }) => [styles.refreshButton, pressed && styles.pressed]}>
          <Text style={styles.refreshButtonText}>{loading ? 'Carregando' : 'Atualizar'}</Text>
        </Pressable>
      </View>

      <View style={[
        styles.bulkActions,
        {
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: spacing[4],
          padding: spacing[4],
        }
      ]}>
        {/* Row 1: Search + Filters */}
        <View style={[
          styles.searchAndFiltersRow,
          {
            flexDirection: width >= 1024 ? 'row' : 'column',
            alignItems: width >= 1024 ? 'center' : 'stretch',
            gap: spacing[3],
          }
        ]}>
          <SearchBar
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            placeholder="Buscar produto por nome..."
            style={{ flex: 1 }}
          />
          
          <View style={[
            styles.filterDropdownsContainer,
            {
              flexDirection: width >= 640 ? 'row' : 'column',
              gap: spacing[2],
            }
          ]}>
            <FilterSelect
              value={filterMarketplace}
              onChange={onFilterMarketplaceChange}
              zIndex={3}
              options={[
                { label: 'Todos Marketplaces', value: 'Todos' },
                { label: 'Shopee', value: 'Shopee' },
                { label: 'Mercado Livre', value: 'Mercado Livre' },
                { label: 'Amazon', value: 'Amazon' },
                { label: 'Outros', value: 'Outros' },
              ]}
            />
            <FilterSelect
              value={filterStatus}
              onChange={onFilterStatusChange}
              zIndex={2}
              options={[
                { label: 'Todos Status', value: 'Todos' },
                { label: 'Anunciados', value: 'Anunciados' },
                { label: 'Pendentes', value: 'Pendentes' },
              ]}
            />
            <FilterSelect
              value={sortBy}
              onChange={onSortByChange}
              zIndex={1}
              options={[
                { label: 'Mais Recentes', value: 'Recentes' },
                { label: 'Nome A-Z', value: 'Nome' },
                { label: 'Preço: Menor-Maior', value: 'PrecoCrescente' },
                { label: 'Preço: Maior-Menor', value: 'PrecoDecrescente' },
              ]}
            />
          </View>
        </View>

        {/* Row 2: Bulk Actions (IA Generate Ad) */}
        <View style={[
          styles.bulkActionsRow,
          {
            flexDirection: width >= 640 ? 'row' : 'column',
            alignItems: width >= 640 ? 'center' : 'stretch',
            justifyContent: 'space-between',
            gap: spacing[3],
            borderTopWidth: 1,
            borderTopColor: colors.borderDefault,
            paddingTop: spacing[4],
          }
        ]}>
          <Text style={styles.selectionText}>
            {selectedCount ? `${selectedCount} selecionado${selectedCount > 1 ? 's' : ''}` : 'Selecione produtos para gerar anúncios'}
          </Text>
          
          <View style={[
            styles.actionButtonContainer,
            {
              alignItems: width >= 640 ? 'flex-end' : 'stretch',
              width: width >= 640 ? 'auto' : '100%',
              gap: 4,
            }
          ]}>
            <AIButton
              title={generatingAd ? 'Gerando...' : 'Gerar Anúncio (IA)'}
              onPress={onGenerateAd}
              disabled={!canGenerateAd}
              loading={generatingAd}
            />
            {!canGenerateAd && !generatingAd ? (
              <Text style={[styles.disabledLabel, { textAlign: width >= 640 ? 'right' : 'center' }]}>
                Selecione produtos sem anúncio para ativar
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {loading && products.length === 0 ? (
        <LoadingState type="cards" count={3} />
      ) : null}

      {!loading && products.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          description={searchQuery ? 'Tente buscar por termos diferentes ou limpe os filtros.' : 'Cadastre seu primeiro produto para começar a gerar anúncios com IA.'}
          icon={searchQuery ? '🔍' : '📦'}
          actionLabel={searchQuery ? undefined : 'Cadastrar Primeiro Produto'}
          onAction={searchQuery ? undefined : onNewProduct}
        />
      ) : null}

      <View style={styles.productList}>
        {products.map((product) => {
          const selected = selectedProductIds.includes(product.id);
          const isAiGenerated = getGeneratedProductFields(product).isGeneratedByAI;

          return (
            <ProductCard
              key={product.id}
              product={product}
              selected={selected}
              isAiGenerated={isAiGenerated}
              deleting={deletingId === product.id}
              onToggle={() => onToggleProduct(product.id)}
              onEdit={() => onEdit(product)}
              onDelete={() => onDelete(product.id)}
              onShowDetails={() => onShowDetails(product)}
              cardWidth={cardWidth}
            />
          );
        })}
      </View>

      <View style={styles.pagination}>
        {/* Count Indicator */}
        <Text style={styles.paginationCountText}>
          {totalCount ? `Mostrando ${(pageNumber - 1) * 10 + 1}-${Math.min(pageNumber * 10, totalCount)} de ${totalCount} produtos` : `Página ${pageNumber}`}
        </Text>

        {/* Page Buttons Selection */}
        <View style={styles.pageSelectorRow}>
          <Pressable
            disabled={!canGoBack || loading}
            onPress={onPrevious}
            style={({ pressed, hovered }) => [
              styles.pageArrowButton,
              (!canGoBack || loading) && styles.disabledButton,
              pressed && styles.pressed,
              hovered && styles.pageArrowButtonHover,
            ]}
          >
            <Text style={styles.pageArrowButtonText}>‹</Text>
          </Pressable>

          {Array.from({ length: totalPages || 1 }).map((_, idx) => {
            const page = idx + 1;
            const isActive = pageNumber === page;
            return (
              <Pressable
                key={page}
                disabled={loading}
                onPress={() => onPageSelect(page)}
                style={({ pressed, hovered }) => [
                  styles.pageNumberButton,
                  isActive && styles.pageNumberButtonActive,
                  pressed && styles.pressed,
                  hovered && !isActive && styles.pageNumberButtonHover,
                ]}
              >
                <Text style={[
                  styles.pageNumberButtonText,
                  isActive && styles.pageNumberButtonTextActive,
                ]}>
                  {page}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            disabled={!canGoForward || loading}
            onPress={onNext}
            style={({ pressed, hovered }) => [
              styles.pageArrowButton,
              (!canGoForward || loading) && styles.disabledButton,
              pressed && styles.pressed,
              hovered && styles.pageArrowButtonHover,
            ]}
          >
            <Text style={styles.pageArrowButtonText}>›</Text>
          </Pressable>
        </View>
      </View>
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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.generatedField}>
      <View style={styles.generatedFieldHeader}>
        <Text style={styles.generatedLabel}>{label}</Text>
        <Pressable onPress={handleCopy} style={({ pressed }) => [styles.copyButton, pressed && styles.pressed]}>
          <Text style={styles.copyButtonText}>{copied ? '✓ Copiado' : '📋 Copiar'}</Text>
        </Pressable>
      </View>
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
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[12],
    paddingBottom: spacing[12],
  },
  webContent: {
    flexGrow: 0,
    minHeight: '100%',
  },
  hero: {
    marginBottom: spacing[6],
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[4],
  },
  heroLeft: {
    flex: 1,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    borderRadius: radii.full,
    backgroundColor: colors.brandSubtle,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    marginBottom: spacing[3],
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
  newProductButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing[5],
  },
  newProductButtonText: {
    color: colors.white,
    ...typography.body,
    fontWeight: '900',
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
    padding: spacing[6],
    ...shadows.sm,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    marginBottom: spacing[5],
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
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgSurface,
    marginBottom: spacing[5],
    zIndex: 10,
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
    paddingHorizontal: spacing[4],
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
    paddingVertical: spacing[4],
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
    width: '100%',
    zIndex: 1,
  },
  productCard: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl + 2,
    backgroundColor: colors.bgSurfaceHover,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[4],
    flexGrow: 0,
    flexShrink: 0,
    ...Platform.select({
      web: {
        transitionProperty: 'all',
        transitionDuration: '200ms',
        cursor: 'pointer',
      },
      default: null,
    }),
  },
  productCardHover: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgSurfaceActive,
    transform: [{ translateY: -3 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  productCardPressed: {
    transform: [{ scale: 0.99 }],
  },
  productCardSelected: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.brandSubtle,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.lg,
    backgroundColor: colors.bgInput,
  },
  checkboxSelected: {
    borderColor: colors.brandText,
    backgroundColor: colors.brandPrimary,
  },
  checkboxText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  checkboxDisabled: {
    borderColor: colors.borderDefault,
    backgroundColor: colors.borderDefault,
    opacity: 0.5,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    color: colors.textPrimary,
  },
  platformAndPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  productPrice: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '900',
  },
  platformBadge: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  platformBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  badgeMeli: {
    backgroundColor: 'rgba(254, 240, 138, 0.1)',
    borderColor: 'rgba(254, 240, 138, 0.3)',
  },
  badgeTextMeli: {
    color: '#FFE600',
  },
  badgeShopee: {
    backgroundColor: 'rgba(255, 87, 34, 0.1)',
    borderColor: 'rgba(255, 87, 34, 0.3)',
  },
  badgeTextShopee: {
    color: '#FF5722',
  },
  badgeAmazon: {
    backgroundColor: 'rgba(255, 153, 0, 0.1)',
    borderColor: 'rgba(255, 153, 0, 0.3)',
  },
  badgeTextAmazon: {
    color: '#FF9900',
  },
  badgeOther: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  badgeTextOther: {
    color: '#94A3B8',
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  featurePill: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radii.md,
    backgroundColor: colors.bgInput,
  },
  featurePillText: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: '700',
    maxWidth: 90,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: 'auto',
  },
  detailsButton: {
    minHeight: 36,
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: colors.brandSubtle,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
  },
  detailsButtonText: {
    fontSize: 12,
    color: colors.brandText,
    fontWeight: '900',
  },
  actionButton: {
    minHeight: 36,
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '900',
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: colors.errorSubtle,
  },
  deleteButtonText: {
    fontSize: 12,
    color: colors.errorText,
    fontWeight: '900',
  },
  fab: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[6],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 99,
  },
  fabText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'center',
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bgOverlay,
    zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdropClickArea: {
    flex: 1,
  },
  drawerContainer: {
    width: 480,
    backgroundColor: colors.bgSurface,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderDefault,
    height: '100%',
    padding: spacing[6],
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    marginBottom: spacing[4],
  },
  drawerTitle: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '900',
  },
  closeDrawerButton: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgInput,
  },
  closeDrawerText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  drawerScroll: {
    flex: 1,
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: colors.bgOverlay,
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: colors.bgSurface,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    padding: spacing[6],
    maxHeight: '90%',
  },
  bottomSheetDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: spacing[4],
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    marginBottom: spacing[4],
  },
  bottomSheetTitle: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '900',
  },
  bottomSheetScroll: {
    maxHeight: 600,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2] + 2,
    marginTop: spacing[6],
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
    zIndex: 1000,
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
  generatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    width: '100%',
  },
  detailsModalContent: {
    width: '100%',
    maxWidth: 520,
    height: 500,
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
    width: '100%',
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
  generatedDetails: {
    borderWidth: 1,
    borderColor: colors.brandActive,
    borderRadius: radii['2xl'],
    backgroundColor: colors.brandSubtle,
    padding: spacing[4],
    gap: spacing[3],
  },
  generatedHeading: {
    ...typography.bodySm,
    color: colors.brandText,
    fontWeight: '900',
  },
  generatedBadge: {
    overflow: 'hidden',
    borderRadius: radii.lg,
    backgroundColor: colors.brandHover,
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: spacing[1.5],
    paddingVertical: spacing[0.5],
  },
  generatedField: {
    gap: spacing[1.5],
    backgroundColor: colors.bgInput,
    padding: spacing[3],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  generatedFieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  copyButton: {
    paddingVertical: 4,
    paddingHorizontal: spacing[2],
    borderRadius: radii.md,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  copyButtonText: {
    fontSize: 11,
    color: colors.brandText,
    fontWeight: '800',
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
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl,
    paddingHorizontal: spacing[3],
    minHeight: 40,
    ...Platform.select({
      web: {
        transitionProperty: 'all',
        transitionDuration: '200ms',
      },
      default: null,
    }),
  },
  searchContainerFocused: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.bgInputFocus,
  },
  searchIcon: {
    marginRight: spacing[2],
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 0,
  },
  actionButtonContainer: {
    gap: 4,
  },
  generateAdButtonActive: {
    backgroundColor: colors.brandPrimary,
  },
  generateAdButtonDisabled: {
    backgroundColor: colors.bgSurfaceActive,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    opacity: 0.6,
  },
  generateAdButtonHover: {
    backgroundColor: colors.brandHover,
  },
  disabledLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: '600',
    marginTop: 2,
  },
  activeSelectionLabel: {
    fontSize: 10,
    color: colors.brandText,
    fontWeight: '800',
    marginTop: 2,
  },
  detailsButtonHover: {
    backgroundColor: colors.brandHover,
  },
  actionButtonHover: {
    backgroundColor: colors.bgSurfaceActive,
    borderColor: colors.borderStrong,
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      web: {
        transitionProperty: 'all',
        transitionDuration: '200ms',
      },
      default: null,
    }),
  },
  deleteButtonHover: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteButtonText: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  metricsContainer: {
    marginBottom: spacing[6],
    width: '100%',
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl,
    backgroundColor: colors.bgSurface,
    padding: spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  metricLabel: {
    ...typography.overline,
    color: colors.textTertiary,
    fontWeight: '800',
  },
  metricIcon: {
    fontSize: 16,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  searchAndFiltersRow: {
    width: '100%',
  },
  filterDropdownsContainer: {
    flexGrow: 0,
    flexShrink: 0,
  },
  bulkActionsRow: {
    width: '100%',
  },
  filterSelectContainer: {
    position: 'relative',
  },
  filterSelectArrow: {
    color: colors.textTertiary,
    fontSize: 10,
    position: 'absolute',
    right: 12,
    top: 15,
    pointerEvents: 'none',
  },
  filterSelectWrapper: {
    position: 'relative',
    zIndex: 20,
    minWidth: 140,
  },
  filterSelectTrigger: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.lg,
    backgroundColor: colors.bgInput,
    paddingHorizontal: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterSelectTriggerText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterSelectArrowMobile: {
    color: colors.textTertiary,
    fontSize: 10,
  },
  filterSelectOptionsList: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.lg,
    backgroundColor: colors.bgSurface,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 99,
  },
  filterSelectOption: {
    paddingVertical: spacing[2.5],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  filterSelectOptionSelected: {
    backgroundColor: colors.brandSubtle,
  },
  filterSelectOptionText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterSelectOptionTextSelected: {
    color: colors.brandText,
    fontWeight: '800',
  },
  paginationCountText: {
    ...typography.bodySm,
    color: colors.textTertiary,
    fontWeight: '700',
  },
  pageSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  pageArrowButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgInput,
  },
  pageArrowButtonHover: {
    backgroundColor: colors.bgSurfaceActive,
    borderColor: colors.brandPrimary,
  },
  pageArrowButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  pageNumberButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgInput,
  },
  pageNumberButtonHover: {
    backgroundColor: colors.bgSurfaceActive,
    borderColor: colors.brandPrimary,
  },
  pageNumberButtonActive: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  pageNumberButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  pageNumberButtonTextActive: {
    color: colors.white,
    fontWeight: '900',
  },
});
