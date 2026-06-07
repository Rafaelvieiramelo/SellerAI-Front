import React, { useMemo } from 'react';
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
                <VisualOptionSelector options={categories} value={value} onChange={onChange} compact />
              </Field>
            )}
          />

          <Controller
            control={control}
            name="marketplace"
            render={({ field: { onChange, value } }) => (
              <Field label="Marketplace" icon="M">
                <VisualOptionSelector options={marketplaces} value={value} onChange={onChange} compact />
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
    gap: spacing[3] + 2,
  },
  section: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgSurface,
    padding: spacing[4] + 2,
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
    gap: spacing[4],
  },
  inlineGrid: {
    gap: spacing[4],
  },
  priceGrid: {
    gap: spacing[3] + 2,
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
});
