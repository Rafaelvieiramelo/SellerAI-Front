import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { Product } from '../domain/models/Product';
import { getGeneratedProductFields } from '../utils/productMappers';
import { styles } from '../screens/ProductAdGeneratorScreen.styles';
import { spacing } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import {
  SearchBar,
  FilterSelect,
  AIButton,
  LoadingState,
  EmptyState,
  ProductCard,
} from '../../../components';

interface ProductListProps {
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
}

export function ProductList({
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
}: ProductListProps) {
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
              title={generatingAd ? 'Gerando...' : 'Gerar Descrição (IA)'}
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
            style={({ pressed, hovered }: any) => [
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
                style={({ pressed, hovered }: any) => [
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
            style={({ pressed, hovered }: any) => [
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
