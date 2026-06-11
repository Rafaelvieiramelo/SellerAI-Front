import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { Skeleton } from './Skeleton';
import { Product } from '../features/product-ad-generator/domain/models/Product';

// Helpers
const getCategoryAvatar = (category: string | null) => {
  const upper = category?.toUpperCase() || '';
  if (upper.includes('ELET') || upper.includes('TECH') || upper.includes('GAMER')) {
    return { text: '🔌', bg: '#1E3A8A' };
  }
  if (upper.includes('CASA') || upper.includes('COZINHA')) {
    return { text: '🍳', bg: '#7C2D12' };
  }
  if (upper.includes('MODA') || upper.includes('VESTU') || upper.includes('ACESS')) {
    return { text: '👕', bg: '#701A75' };
  }
  if (upper.includes('BELEZA') || upper.includes('SAUDE') || upper.includes('COSM')) {
    return { text: '🧴', bg: '#064E3B' };
  }
  if (upper.includes('ESPO')) {
    return { text: '⚽', bg: '#115E59' };
  }
  if (upper.includes('BRINQ') || upper.includes('TOY') || upper.includes('KID')) {
    return { text: '🧩', bg: '#854D0E' };
  }
  return { text: '📦', bg: '#334155' };
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

// ==========================================
// 1. Buttons
// ==========================================

interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const content = (
    <View style={[styles.btnContent, fullWidth && styles.wFull]}>
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <Text style={styles.btnIcon}>{icon}</Text>}
          <Text style={styles.btnLabelPrimary}>{title}</Text>
          {icon && iconPosition === 'right' && <Text style={styles.btnIcon}>{icon}</Text>}
        </>
      )}
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btnBase,
        fullWidth && styles.wFull,
        isDisabled && styles.btnDisabled,
        pressed && !isDisabled && styles.btnPressed,
        style,
      ]}
    >
      <LinearGradient
        colors={isDisabled ? [colors.bgSurfaceActive, colors.bgSurfaceActive] : [colors.brandPrimary, colors.brandHover]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btnGradient}
      >
        {content}
      </LinearGradient>
    </Pressable>
  );
}

export function SecondaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed, hovered }: any) => [
        styles.btnBase,
        styles.btnSecondary,
        fullWidth && styles.wFull,
        isDisabled && styles.btnDisabled,
        pressed && !isDisabled && styles.btnPressed,
        hovered && !isDisabled && styles.btnSecondaryHover,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textSecondary} size="small" />
      ) : (
        <View style={styles.btnContent}>
          {icon && iconPosition === 'left' && <Text style={styles.btnIconSecondary}>{icon}</Text>}
          <Text style={styles.btnLabelSecondary}>{title}</Text>
          {icon && iconPosition === 'right' && <Text style={styles.btnIconSecondary}>{icon}</Text>}
        </View>
      )}
    </Pressable>
  );
}

export function AIButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = '✨',
  iconPosition = 'left',
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const content = (
    <View style={[styles.btnContent, fullWidth && styles.wFull]}>
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <Text style={styles.btnIconAI}>{icon}</Text>}
          <Text style={styles.btnLabelAI}>{title}</Text>
          {icon && iconPosition === 'right' && <Text style={styles.btnIconAI}>{icon}</Text>}
        </>
      )}
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed, hovered }: any) => [
        styles.btnBase,
        fullWidth && styles.wFull,
        isDisabled && styles.btnDisabled,
        pressed && !isDisabled && styles.btnPressed,
        hovered && !isDisabled && styles.btnAIHover,
        !isDisabled && styles.btnAIGlow,
        style,
      ]}
    >
      <LinearGradient
        colors={isDisabled ? [colors.bgSurfaceActive, colors.bgSurfaceActive] : ['#3B82F6', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btnGradient}
      >
        {content}
      </LinearGradient>
    </Pressable>
  );
}

// ==========================================
// 2. StatsCard
// ==========================================

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  type?: 'total' | 'announced' | 'pending';
}

export function StatsCard({ label, value, icon, type = 'total' }: StatsCardProps) {
  const accentColor = 
    type === 'announced' ? colors.success : 
    type === 'pending' ? colors.warning : 
    colors.brandPrimary;

  const borderAccentStyle = {
    borderLeftWidth: 4,
    borderLeftColor: accentColor,
  };

  return (
    <View style={[styles.statsCard, borderAccentStyle]}>
      <View style={styles.statsCardHeader}>
        <Text style={styles.statsLabel}>{label}</Text>
        <View style={[styles.statsIconBox, { backgroundColor: type === 'announced' ? 'rgba(34, 197, 94, 0.1)' : type === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)' }]}>
          <Text style={[styles.statsIcon, { color: accentColor }]}>{icon}</Text>
        </View>
      </View>
      <Text style={styles.statsValue}>{value}</Text>
    </View>
  );
}

// ==========================================
// 3. MarketplaceBadge
// ==========================================

interface MarketplaceBadgeProps {
  platform: string | null;
}

export function MarketplaceBadge({ platform }: MarketplaceBadgeProps) {
  const norm = platform?.toLowerCase() || '';
  const isMeli = norm.includes('mercado') || norm.includes('livre') || norm === 'ml';
  const isShopee = norm.includes('shopee');
  const isAmazon = norm.includes('amazon');

  if (isMeli) {
    return (
      <View style={[styles.mktBadge, styles.badgeMeli]}>
        <Text style={[styles.mktBadgeText, styles.textMeli]}>Mercado Livre</Text>
      </View>
    );
  }
  if (isShopee) {
    return (
      <View style={[styles.mktBadge, styles.badgeShopee]}>
        <Text style={[styles.mktBadgeText, styles.textShopee]}>Shopee</Text>
      </View>
    );
  }
  if (isAmazon) {
    return (
      <View style={[styles.mktBadge, styles.badgeAmazon]}>
        <Text style={[styles.mktBadgeText, styles.textAmazon]}>Amazon</Text>
      </View>
    );
  }
  return (
    <View style={[styles.mktBadge, styles.badgeOther]}>
      <Text style={[styles.mktBadgeText, styles.textOther]}>{platform || 'Outro'}</Text>
    </View>
  );
}

// ==========================================
// 4. SearchBar
// ==========================================

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar...', style }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[
      styles.searchBarContainer,
      isFocused && styles.searchBarContainerFocused,
      style
    ]}>
      <Text style={styles.searchBarIcon}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.searchBarInput}
      />
    </View>
  );
}

// ==========================================
// 5. FilterSelect
// ==========================================

interface FilterSelectProps {
  value: string;
  onChange: (val: any) => void;
  options: { label: string; value: string }[];
  zIndex?: number;
}

export function FilterSelect({ value, onChange, options, zIndex = 1 }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  if (Platform.OS === 'web') {
    return (
      <View style={styles.filterSelectContainer}>
        <select
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            borderRadius: 12,
            backgroundColor: colors.bgInput,
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: '700',
            paddingHorizontal: 12,
            appearance: 'none',
            borderStyle: 'solid',
            outline: 'none',
            fontFamily: 'inherit',
            cursor: 'pointer',
          } as any}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ backgroundColor: colors.bgSurface, color: colors.textPrimary } as any}>
              {opt.label}
            </option>
          ))}
        </select>
        <Text style={styles.filterSelectArrow}>▼</Text>
      </View>
    );
  }

  return (
    <View style={[styles.filterSelectWrapper, { zIndex }]}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={styles.filterSelectTrigger}
      >
        <Text style={styles.filterSelectTriggerText}>{selectedOption.label}</Text>
        <Text style={styles.filterSelectArrowMobile}>▼</Text>
      </Pressable>
      {isOpen && (
        <View style={styles.filterSelectOptionsList}>
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={({ pressed }) => [
                styles.filterSelectOption,
                opt.value === value && styles.filterSelectOptionSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.filterSelectOptionText,
                  opt.value === value && styles.filterSelectOptionTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ==========================================
// 6. EmptyState
// ==========================================

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({ title, description, icon = '📦', actionLabel, onAction, style }: EmptyStateProps) {
  return (
    <View style={[styles.emptyStateContainer, style]}>
      <Text style={styles.emptyStateIcon}>{icon}</Text>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateDescription}>{description}</Text>
      {actionLabel && onAction && (
        <PrimaryButton title={actionLabel} onPress={onAction} style={styles.emptyStateAction} />
      )}
    </View>
  );
}

// ==========================================
// 7. ProductCard Component
// ==========================================

interface ProductCardProps {
  product: Product;
  selected: boolean;
  isAiGenerated: boolean;
  deleting: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShowDetails: () => void;
  cardWidth: string | number;
}

export function ProductCard({
  product,
  selected,
  isAiGenerated,
  deleting,
  onToggle,
  onEdit,
  onDelete,
  onShowDetails,
  cardWidth,
}: ProductCardProps) {
  const cat = getCategoryAvatar(product.category);

  return (
    <Pressable
      onPress={() => {
        if (!isAiGenerated) {
          onToggle();
        }
      }}
      style={({ pressed, hovered }: any) => [
        styles.productCard,
        selected && styles.productCardSelected,
        hovered && styles.productCardHover,
        pressed && styles.productCardPressed,
        { width: cardWidth }
      ]}
    >
      <View style={styles.cardHeader}>
        <Pressable
          onPress={() => {
            if (!isAiGenerated) {
              onToggle();
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
          <Text style={styles.checkboxText}>{isAiGenerated ? 'IA' : selected ? '✓' : ''}</Text>
        </Pressable>

        <View style={[styles.avatarBox, { backgroundColor: cat.bg }]}>
          <LinearGradient
            colors={[cat.bg, colors.bgPrimary]}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarEmoji}>{cat.text}</Text>
          </LinearGradient>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.platformAndPrice}>
            <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
            <MarketplaceBadge platform={product.marketplace} />
          </View>
        </View>
      </View>

      {product.features?.length ? (
        <View style={styles.featurePills}>
          {product.features.slice(0, 3).map((feat, i) => (
            <View key={i} style={styles.featurePill}>
              <Text style={styles.featurePillText} numberOfLines={1}>{feat}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.cardActions}>
        {isAiGenerated ? (
          <Pressable
            onPress={onShowDetails}
            style={({ pressed, hovered }: any) => [
              styles.detailsButton,
              hovered && styles.detailsButtonHover,
              pressed && styles.pressed
            ]}
          >
            <Text style={styles.detailsButtonText}>Ver Copys</Text>
          </Pressable>
        ) : null}
        
        <Pressable
          onPress={onEdit}
          style={({ pressed, hovered }: any) => [
            styles.actionButton,
            hovered && styles.actionButtonHover,
            pressed && styles.pressed
          ]}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </Pressable>
        
        <Pressable
          onPress={onDelete}
          disabled={deleting}
          style={({ pressed, hovered }: any) => [
            styles.deleteButton,
            hovered && styles.deleteButtonHover,
            pressed && styles.pressed,
          ]}
        >
          {({ hovered }: any) => (
            <Text style={[
              styles.deleteButtonText,
              hovered && { color: colors.error }
            ]}>
              {deleting ? '...' : '🗑️'}
            </Text>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

// ==========================================
// 8. LoadingState (Skeletons)
// ==========================================

export function StatsCardSkeleton() {
  return (
    <View style={[styles.statsCard, { borderLeftWidth: 4, borderLeftColor: colors.borderDefault, height: 100, justifyContent: 'center' }]}>
      <Skeleton width="40%" height={14} style={{ marginBottom: 12 }} />
      <Skeleton width="70%" height={24} />
    </View>
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={[styles.productCardDummy]}>
      <View style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'center', marginBottom: spacing[4] }}>
        <Skeleton width={56} height={56} borderRadius={radii.xl} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton width="90%" height={15} />
          <Skeleton width="50%" height={15} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2], marginBottom: spacing[4] }}>
        <Skeleton width={60} height={18} borderRadius={radii.md} />
        <Skeleton width={60} height={18} borderRadius={radii.md} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2], marginTop: 'auto' }}>
        <Skeleton width="45%" height={36} borderRadius={radii.lg} />
        <Skeleton width="45%" height={36} borderRadius={radii.lg} />
      </View>
    </View>
  );
}

export function LoadingState({ type = 'cards', count = 3 }: { type?: 'cards' | 'stats'; count?: number }) {
  return (
    <View style={styles.loadingList}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={type === 'stats' ? styles.statsSkeletonItem : styles.cardSkeletonItem}>
          {type === 'stats' ? <StatsCardSkeleton /> : <ProductCardSkeleton />}
        </View>
      ))}
    </View>
  );
}

// ==========================================
// 9. PageHeader
// ==========================================

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export function PageHeader({ title, subtitle, badgeText, action, style }: PageHeaderProps) {
  return (
    <View style={[styles.pageHeader, style]}>
      <View style={styles.headerLeft}>
        {badgeText && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{badgeText}</Text>
          </View>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {action && <View style={styles.headerActionContainer}>{action}</View>}
    </View>
  );
}

// ==========================================
// Styles
// ==========================================

const styles = StyleSheet.create({
  // Global helpers
  wFull: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  // Buttons base
  btnBase: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    height: 48,
    alignItems: 'stretch',
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  btnIcon: {
    fontSize: 16,
    color: colors.white,
  },
  btnLabelPrimary: {
    color: colors.white,
    ...typography.bodyLg,
    fontWeight: '700',
  },

  // Secondary Button
  btnSecondary: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
  },
  btnSecondaryHover: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgSurfaceHover,
  },
  btnIconSecondary: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  btnLabelSecondary: {
    color: colors.textSecondary,
    ...typography.bodyLg,
    fontWeight: '600',
  },

  // AI Button
  btnIconAI: {
    fontSize: 16,
    color: colors.white,
  },
  btnLabelAI: {
    color: colors.white,
    ...typography.bodyLg,
    fontWeight: '700',
  },
  btnAIHover: {
    transform: [{ scale: 1.02 }],
  },
  btnAIGlow: {
    ...Platform.select({
      web: {
        boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
      },
      default: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnPressed: {
    transform: [{ scale: 0.98 }],
  },

  // Stats Card
  statsCard: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[5],
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  statsLabel: {
    ...typography.bodySm,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  statsIconBox: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsIcon: {
    fontSize: 14,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
  },

  // Marketplace Badges
  mktBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  mktBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  badgeMeli: {
    backgroundColor: 'rgba(254, 240, 138, 0.1)',
    borderColor: 'rgba(254, 240, 138, 0.3)',
  },
  textMeli: {
    color: '#FFE600',
  },
  badgeShopee: {
    backgroundColor: 'rgba(255, 87, 34, 0.1)',
    borderColor: 'rgba(255, 87, 34, 0.3)',
  },
  textShopee: {
    color: '#FF5722',
  },
  badgeAmazon: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  textAmazon: {
    color: '#3B82F6',
  },
  badgeOther: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  textOther: {
    color: '#94A3B8',
  },

  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: 14,
    height: 40,
    ...Platform.select({
      web: {
        transition: 'all 200ms ease',
      },
      default: null,
    }),
  },
  searchBarContainerFocused: {
    borderColor: colors.brandPrimary,
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
      },
      default: null,
    }),
  },
  searchBarIcon: {
    fontSize: 14,
    color: colors.textTertiary,
    marginRight: spacing[2],
  },
  searchBarInput: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    ...typography.bodySm,
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
      default: null,
    }),
  },

  // Filter Select (native web vs. custom mobile list)
  filterSelectContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  filterSelectArrow: {
    position: 'absolute',
    right: 12,
    fontSize: 8,
    color: colors.textTertiary,
    pointerEvents: 'none',
  },
  filterSelectWrapper: {
    position: 'relative',
  },
  filterSelectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl,
    backgroundColor: colors.bgInput,
    paddingHorizontal: spacing[4],
    minWidth: 140,
  },
  filterSelectTriggerText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  filterSelectArrowMobile: {
    fontSize: 8,
    color: colors.textTertiary,
    marginLeft: spacing[2],
  },
  filterSelectOptionsList: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl,
    padding: spacing[1],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  filterSelectOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.lg,
  },
  filterSelectOptionSelected: {
    backgroundColor: colors.bgSurfaceActive,
  },
  filterSelectOptionText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  filterSelectOptionTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },

  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[6],
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    width: '100%',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: spacing[4],
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  emptyStateDescription: {
    ...typography.bodySm,
    color: colors.textTertiary,
    textAlign: 'center',
    maxWidth: 360,
    marginBottom: spacing[6],
  },
  emptyStateAction: {
    minWidth: 180,
  },

  // Product Card Details inside grid
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
    ...Platform.select({
      web: {
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
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
  detailsButtonHover: {
    backgroundColor: colors.brandHover,
    borderColor: colors.brandActive,
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
  actionButtonHover: {
    backgroundColor: colors.bgSurfaceHover,
    borderColor: colors.borderStrong,
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
  deleteButtonHover: {
    backgroundColor: colors.error,
  },
  deleteButtonText: {
    fontSize: 12,
    color: colors.errorText,
    fontWeight: '900',
  },

  // Page Header
  pageHeader: {
    marginBottom: spacing[6],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[4],
  },
  headerLeft: {
    flex: 1,
  },
  headerBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    borderRadius: radii.full,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    marginBottom: spacing[3],
  },
  headerBadgeText: {
    color: colors.brandText,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textTertiary,
    lineHeight: 22,
    marginTop: 6,
    maxWidth: 520,
    fontWeight: '600',
  },
  headerActionContainer: {
    justifyContent: 'center',
  },

  // Loading List Skeletons
  loadingList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
    width: '100%',
  },
  statsSkeletonItem: {
    flex: 1,
    minWidth: 180,
  },
  cardSkeletonItem: {
    flexGrow: 1,
    flexShrink: 0,
  },

  // Dummy skeletons card container
  productCardDummy: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl + 2,
    backgroundColor: colors.bgSurfaceHover,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[4],
    width: '100%',
  },
});
