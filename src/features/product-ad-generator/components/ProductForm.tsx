import React, { useMemo, useState } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Pressable, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateCommercialMargin } from '../application/generateProductAdMock';
import { audiences, categories, marketplaces, ProductAdFormData, tones } from '../domain/productAdTypes';
import { FeatureTagsInput } from './FeatureTagsInput';
import { ImageUploader } from './ImageUploader';
import { VisualOptionSelector } from './VisualOptionSelector';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radii } from '../../../theme/radii';
import { shadows } from '../../../theme/shadows';

interface CategorySelectProps {
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
}

function CategorySelect({ value, onChange, options }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.dropdownContainer}>
        <select
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          style={{
            width: '100%',
            height: 54,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            borderRadius: 16,
            backgroundColor: colors.bgInput,
            color: colors.textPrimary,
            fontSize: 15,
            fontWeight: '700',
            paddingHorizontal: 16,
            appearance: 'none',
            borderStyle: 'solid',
            outline: 'none',
            fontFamily: 'inherit',
          } as any}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} style={{ backgroundColor: colors.bgSurface, color: colors.textPrimary } as any}>
              {opt}
            </option>
          ))}
        </select>
        <Text style={styles.dropdownArrowWeb}>▼</Text>
      </View>
    );
  }

  return (
    <View style={styles.dropdownWrapper}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={styles.dropdownTrigger}
      >
        <Text style={styles.dropdownTriggerText}>{value}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </Pressable>
      {isOpen && (
        <View style={styles.dropdownOptionsList}>
          {options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              style={({ pressed }) => [
                styles.dropdownOption,
                opt === value && styles.dropdownOptionSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.dropdownOptionText,
                  opt === value && styles.dropdownOptionTextSelected,
                ]}
              >
                {opt}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

interface MarketplaceSelectorProps {
  value: string;
  onChange: (val: any) => void;
  options: readonly string[];
}

function MarketplaceSelector({ value, onChange, options }: MarketplaceSelectorProps) {
  return (
    <View style={styles.marketplaceSelectorRow}>
      {options.map((opt) => {
        const isSelected = value === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={({ pressed }) => [
              styles.marketplaceBtn,
              isSelected ? styles.marketplaceBtnSelected : styles.marketplaceBtnUnselected,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.marketplaceBtnText,
                isSelected ? styles.marketplaceBtnTextSelected : styles.marketplaceBtnTextUnselected,
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface ProductFormProps {
  control: Control<ProductAdFormData>;
  errors: FieldErrors<ProductAdFormData>;
  loading: boolean;
  onSubmit: () => void;
  onCancelEdit?: () => void;
  submitLabel?: string;
  watchedCostPrice: string;
  watchedSalePrice: string;
}

export function ProductForm({
  control,
  errors,
  loading,
  onSubmit,
  onCancelEdit,
  submitLabel,
  watchedCostPrice,
  watchedSalePrice,
}: ProductFormProps) {
  const margin = useMemo(
    () => calculateCommercialMargin(watchedCostPrice, watchedSalePrice),
    [watchedCostPrice, watchedSalePrice],
  );

  return (
    <View style={styles.form}>
      <Section title="Informações principais" eyebrow="Base do anúncio">
        <Controller
          control={control}
          name="productName"
          render={({ field: { onChange, value } }) => (
            <Field label="Nome do Produto" icon="P" error={errors.productName?.message}>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Ex: Fone Bluetooth Gamer RGB"
                placeholderTextColor={colors.textTertiary}
                style={[styles.input, errors.productName && styles.inputError]}
              />
            </Field>
          )}
        />

        <View style={styles.inlineGrid}>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <Field label="Categoria" icon="C">
                <CategorySelect options={categories} value={value} onChange={onChange} />
              </Field>
            )}
          />

          <Controller
            control={control}
            name="marketplace"
            render={({ field: { onChange, value } }) => (
              <Field label="Marketplace" icon="M">
                <MarketplaceSelector options={marketplaces} value={value} onChange={onChange} />
              </Field>
            )}
          />
        </View>
      </Section>

      <Section title="Características" eyebrow="Contexto para IA">
        <Controller
          control={control}
          name="features"
          render={({ field: { onChange, value } }) => (
            <FeatureTagsInput value={value} onChange={onChange} error={errors.features?.message} />
          )}
        />
      </Section>

      <Section title="Público-alvo" eyebrow="Direção da oferta">
        <Controller
          control={control}
          name="audience"
          render={({ field: { onChange, value } }) => (
            <VisualOptionSelector options={audiences} value={value} onChange={onChange} />
          )}
        />
      </Section>

      <Section title="Informações comerciais" eyebrow="Preço e margem">
        <View style={styles.priceGrid}>
          <Controller
            control={control}
            name="costPrice"
            render={({ field: { onChange, value } }) => (
              <Field label="Preço de custo" icon="$" error={errors.costPrice?.message}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  keyboardType="decimal-pad"
                  placeholder="0,00"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.input, errors.costPrice && styles.inputError]}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name="salePrice"
            render={({ field: { onChange, value } }) => (
              <Field label="Preço de venda" icon="$" error={errors.salePrice?.message}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  keyboardType="decimal-pad"
                  placeholder="0,00"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.input, errors.salePrice && styles.inputError]}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name="targetMargin"
            render={({ field: { onChange, value } }) => (
              <Field label="Margem desejada" icon="%">
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  keyboardType="decimal-pad"
                  placeholder="30"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                />
              </Field>
            )}
          />
        </View>

        <View style={styles.marginPanel}>
          <View>
            <Text style={styles.marginLabel}>Margem automática</Text>
            <Text style={styles.marginHint}>Calculada pelo custo e venda informados.</Text>
          </View>
          <View style={[styles.marginBadge, margin >= 25 && styles.marginBadgeGood]}>
            <Text style={styles.marginBadgeText}>{margin}%</Text>
          </View>
        </View>
      </Section>

      <Section title="Tom do anúncio" eyebrow="Personalidade da copy">
        <Controller
          control={control}
          name="tone"
          render={({ field: { onChange, value } }) => (
            <VisualOptionSelector options={tones} value={value} onChange={onChange} />
          )}
        />
      </Section>

      <Section title="Upload de imagem" eyebrow="Visual do produto">
        <Controller
          control={control}
          name="imageUri"
          render={({ field: { onChange, value } }) => <ImageUploader value={value} onChange={onChange} />}
        />
      </Section>

      <Pressable onPress={onSubmit} disabled={loading} style={({ pressed }) => [styles.submit, pressed && styles.submitPressed]}>
        <LinearGradient colors={[colors.brandPrimary, colors.brandHover]} style={styles.submitGradient}>
          <Text style={styles.submitText}>{loading ? 'Salvando produto...' : submitLabel ?? 'Salvar Produto'}</Text>
        </LinearGradient>
      </Pressable>

      {onCancelEdit ? (
        <Pressable onPress={onCancelEdit} disabled={loading} style={({ pressed }) => [styles.cancelButton, pressed && styles.submitPressed]}>
          <Text style={styles.cancelButtonText}>Cancelar edição</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function Section({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <View style={styles.labelIcon}>
          <Text style={styles.labelIconText}>{icon}</Text>
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing[6],
  },
  section: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgSurface,
    padding: spacing[6],
    ...shadows.sm,
  },
  sectionHeader: {
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
  sectionBody: {
    gap: spacing[5],
  },
  inlineGrid: {
    gap: spacing[4],
  },
  priceGrid: {
    gap: spacing[5],
  },
  field: {
    gap: spacing[2],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  labelIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: colors.brandSubtle,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
  },
  labelIconText: {
    color: colors.brandText,
    fontSize: 11,
    fontWeight: '900',
  },
  label: {
    ...typography.bodySm,
    color: colors.textSecondary,
    fontWeight: '800',
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgInput,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: spacing[4],
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.errorText,
    fontWeight: '700',
  },
  marginPanel: {
    minHeight: 72,
    borderRadius: radii.xl + 2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    padding: spacing[3] + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  marginLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  marginHint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 3,
    fontWeight: '600',
  },
  marginBadge: {
    minWidth: 64,
    alignItems: 'center',
    borderRadius: radii.full,
    backgroundColor: colors.errorSubtle,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  marginBadgeGood: {
    backgroundColor: colors.successSubtle,
  },
  marginBadgeText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  submit: {
    borderRadius: radii['2xl'],
    overflow: 'hidden',
    marginTop: spacing[1],
    marginBottom: spacing[4],
  },
  submitPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  submitGradient: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2] + 2,
    paddingHorizontal: spacing[4] + 2,
  },
  submitText: {
    color: colors.white,
    ...typography.h3,
    fontWeight: '900',
  },
  cancelButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl + 2,
    marginTop: -spacing[2],
    marginBottom: spacing[4],
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '900',
  },
  dropdownContainer: {
    position: 'relative',
    width: '100%',
  },
  dropdownWrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 10,
  },
  dropdownTrigger: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgInput,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  dropdownArrow: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  dropdownArrowWeb: {
    color: colors.textTertiary,
    fontSize: 11,
    position: 'absolute',
    right: 16,
    top: 22,
    pointerEvents: 'none',
  },
  dropdownOptionsList: {
    marginTop: spacing[1],
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl,
    backgroundColor: colors.bgSurface,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownOption: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.brandSubtle,
  },
  dropdownOptionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownOptionTextSelected: {
    color: colors.brandText,
    fontWeight: '800',
  },
  marketplaceSelectorRow: {
    flexDirection: 'row',
    gap: spacing[3],
    width: '100%',
  },
  marketplaceBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  marketplaceBtnSelected: {
    borderColor: colors.brandText,
    backgroundColor: colors.brandSubtle,
  },
  marketplaceBtnUnselected: {
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgInput,
  },
  marketplaceBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  marketplaceBtnTextSelected: {
    color: colors.brandText,
  },
  marketplaceBtnTextUnselected: {
    color: colors.textSecondary,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
