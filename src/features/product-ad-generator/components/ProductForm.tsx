import React, { useMemo } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Pressable, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateCommercialMargin } from '../application/generateProductAdMock';
import { audiences, categories, marketplaces, ProductAdFormData, tones } from '../domain/productAdTypes';
import { FeatureTagsInput } from './FeatureTagsInput';
import { ImageUploader } from './ImageUploader';
import { VisualOptionSelector } from './VisualOptionSelector';

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
                placeholderTextColor="#64748b"
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
                  placeholderTextColor="#64748b"
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
                  placeholderTextColor="#64748b"
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
                  placeholderTextColor="#64748b"
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
        <LinearGradient colors={['#0ea5e9', '#2563eb']} style={styles.submitGradient}>
          <Text style={styles.submitIcon}>OK</Text>
          <Text style={styles.submitText}>{loading ? 'Gerando anúncio...' : 'Gerar anúncio com IA'}</Text>
        </LinearGradient>
      </Pressable>

      {onCancelEdit ? (
        <Pressable onPress={onCancelEdit} disabled={loading} style={({ pressed }) => [styles.cancelButton, pressed && styles.submitPressed]}>
          <Text style={styles.cancelButtonText}>Cancelar edicao</Text>
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
    gap: 14,
  },
  section: {
    borderWidth: 1,
    borderColor: '#1f2d3f',
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.18,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 0,
      },
      default: null,
    }),
  },
  sectionHeader: {
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
  sectionBody: {
    gap: 16,
  },
  inlineGrid: {
    gap: 16,
  },
  priceGrid: {
    gap: 14,
  },
  field: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#12283f',
    borderWidth: 1,
    borderColor: '#1d9bf0',
  },
  labelIconText: {
    color: '#bae6fd',
    fontSize: 11,
    fontWeight: '900',
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#203044',
    borderRadius: 16,
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: '#fb7185',
  },
  errorText: {
    color: '#fb7185',
    fontSize: 12,
    fontWeight: '700',
  },
  marginPanel: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#22364d',
    backgroundColor: '#0d1b2c',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  marginLabel: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '900',
  },
  marginHint: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  marginBadge: {
    minWidth: 64,
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#3f1d2a',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  marginBadgeGood: {
    backgroundColor: '#123524',
  },
  marginBadgeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  submit: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 16,
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
    gap: 10,
    paddingHorizontal: 18,
  },
  submitIcon: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  cancelButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    marginTop: -8,
    marginBottom: 16,
  },
  cancelButtonText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '900',
  },
});
