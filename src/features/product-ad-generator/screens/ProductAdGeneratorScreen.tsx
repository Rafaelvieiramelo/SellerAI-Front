import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { productAdSchema } from '../application/productAdSchema';
import { ProductAdFormData } from '../domain/productAdTypes';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ProductForm } from '../components/ProductForm';
import { useProducts } from '../presentation/hooks/useProducts';
import { Product, productFormToCreateRequest } from '../domain/models/Product';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import {
  PrimaryButton,
  StatsCard,
  PageHeader,
} from '../../../components';
import { ProductList } from '../components/ProductList';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { ErrorModal } from '../components/ErrorModal';
import { styles } from './ProductAdGeneratorScreen.styles';
import {
  productToFormData,
  getGeneratedProductFields,
} from '../utils/productMappers';

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
      currentIds.includes(id) ? currentIds.filter((selectedId) => selectedId !== id) : [...currentIds, id]
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
              <Animated.Text style={styles.drawerTitle}>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</Animated.Text>
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
