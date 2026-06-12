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
import { useAuth } from '../../auth/presentation/contexts/AuthContext';
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
  sku: '',
  stockQuantity: 0,
  costPrice: '',
  targetMargin: '30',
  tone: 'Persuasivo',
  audience: 'Gamer',
  features: ['Bluetooth 5.3', 'RGB', 'Baixa Latência'],
  imageUri: undefined,
  listings: [
    { marketplace: 'Shopee', price: '', enabled: false },
    { marketplace: 'Mercado Livre', price: '', enabled: false },
  ],
};

export default function ProductAdGeneratorScreen() {
  const { user, logout } = useAuth();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(100));
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
        p.listings?.some((l) => l.marketplace?.toLowerCase().includes(query))
      );
    }

    // 2. Marketplace Filter
    if (filterMarketplace !== 'Todos') {
      list = list.filter((p) => {
        const matches = p.listings?.some((l) => {
          const lMkt = l.marketplace.toLowerCase();
          if (filterMarketplace === 'Mercado Livre') return lMkt.includes('mercado') || lMkt.includes('livre') || lMkt === 'ml';
          if (filterMarketplace === 'Shopee') return lMkt.includes('shopee');
          if (filterMarketplace === 'Amazon') return lMkt.includes('amazon');
          return false;
        });
        return matches;
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
        return (a.costPrice || 0) - (b.costPrice || 0);
      }
      if (sortBy === 'PrecoDecrescente') {
        return (b.costPrice || 0) - (a.costPrice || 0);
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
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isFormOpen]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const shouldLock = isFormOpen || detailsProduct !== null || generationError !== null;
      if (shouldLock) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
    return () => {
      if (Platform.OS === 'web') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isFormOpen, detailsProduct, generationError]);

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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <PrimaryButton title="+ Novo Produto" onPress={handleNewProduct} />
              <UserProfileDropdown user={user} logout={logout} />
            </View>
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
          <Animated.View style={[
            styles.drawerContainer,
            {
              opacity: slideAnim.interpolate({
                inputRange: [0, 100],
                outputRange: [1, 0]
              }),
              transform: [{ translateY: slideAnim }]
            }
          ]}>
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

function UserProfileDropdown({ user, logout }: { user: any; logout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'US';

  return (
    <View style={{ position: 'relative', zIndex: 9999 }}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={({ pressed }) => [
          {
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: colors.brandPrimary,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.borderDefault,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{initials}</Text>
      </Pressable>

      {isOpen && (
        <>
          {Platform.OS === 'web' && (
            <Pressable
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9998,
              } as any}
              onPress={() => setIsOpen(false)}
            />
          )}
          <View
            style={{
              position: 'absolute',
              top: 50,
              right: 0,
              width: 240,
              backgroundColor: colors.bgSurface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.borderDefault,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
              zIndex: 9999,
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                fontWeight: '600',
                marginBottom: 4,
              }}
            >
              CONTA ATIVA
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontWeight: '700',
                marginBottom: 16,
                wordBreak: 'break-all',
              } as any}
              numberOfLines={1}
            >
              {user?.email || 'usuario@sellerai.com'}
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: colors.borderDefault,
                marginBottom: 12,
              }}
            />
            <Pressable
              onPress={() => {
                setIsOpen(false);
                logout();
              }}
              style={({ pressed }) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 13 }}>Sair da Conta</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
