import React, { useMemo, useState } from 'react';
import { Controller, Control, FieldErrors, useFieldArray, useWatch } from 'react-hook-form';
import { Pressable, Platform, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateCommercialMargin } from '../application/generateProductAdMock';
import { audiences, categories, ProductAdFormData, tones } from '../domain/productAdTypes';
import { FeatureTagsInput } from './FeatureTagsInput';
import { ImageUploader } from './ImageUploader';
import { VisualOptionSelector } from './VisualOptionSelector';
import { colors } from '../../../theme/colors';
import { styles } from './ProductForm.styles';

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

interface ProductFormProps {
  control: Control<ProductAdFormData>;
  errors: FieldErrors<ProductAdFormData>;
  loading: boolean;
  onSubmit: () => void;
  onCancelEdit?: () => void;
  submitLabel?: string;
}

export function ProductForm({
  control,
  errors,
  loading,
  onSubmit,
  onCancelEdit,
  submitLabel,
}: ProductFormProps) {
  const watchedCostPrice = useWatch({ control, name: 'costPrice' }) || '';
  const watchedListings = useWatch({ control, name: 'listings' }) || [];

  const firstEnabledListing = watchedListings.find(l => l.enabled && l.price);
  const watchedSalePrice = firstEnabledListing ? firstEnabledListing.price : '';

  const margin = useMemo(
    () => calculateCommercialMargin(watchedCostPrice, watchedSalePrice),
    [watchedCostPrice, watchedSalePrice],
  );

  const { fields } = useFieldArray({
    control,
    name: 'listings',
  });

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
            name="sku"
            render={({ field: { onChange, value } }) => (
              <Field label="SKU Central" icon="🔑" error={errors.sku?.message}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ex: FONE-RGB-01"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.input, errors.sku && styles.inputError]}
                />
              </Field>
            )}
          />
        </View>

        <Controller
          control={control}
          name="stockQuantity"
          render={({ field: { onChange, value } }) => (
            <Field label="Estoque Central" icon="📦" error={errors.stockQuantity?.message}>
              <TextInput
                value={value !== undefined ? String(value) : '0'}
                onChangeText={(val) => onChange(Number(val) || 0)}
                keyboardType="number-pad"
                placeholder="Ex: 50"
                placeholderTextColor={colors.textTertiary}
                style={[styles.input, errors.stockQuantity && styles.inputError]}
              />
            </Field>
          )}
        />
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
        <View style={styles.inlineGrid}>
          <Controller
            control={control}
            name="costPrice"
            render={({ field: { onChange, value } }) => (
              <Field label="Preço de custo base" icon="$" error={errors.costPrice?.message}>
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
            name="targetMargin"
            render={({ field: { onChange, value } }) => (
              <Field label="Margem desejada (%)" icon="%">
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
            <Text style={styles.marginHint}>Calculada com base no 1º canal ativado.</Text>
          </View>
          <View style={[styles.marginBadge, margin >= 25 && styles.marginBadgeGood]}>
            <Text style={styles.marginBadgeText}>{margin}%</Text>
          </View>
        </View>
      </Section>

      <Section title="Canais de venda" eyebrow="Habilitar e definir preços">
        {fields.map((field, index) => {
          const isEnabled = watchedListings[index]?.enabled;
          return (
            <View key={field.id} style={styles.variationCard}>
              <View style={[styles.variationCardHeader, { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={styles.variationCardTitle}>{(field as any).marketplace}</Text>
                <Controller
                  control={control}
                  name={`listings.${index}.enabled` as const}
                  render={({ field: { onChange, value } }) => (
                    <Pressable
                      onPress={() => onChange(!value)}
                      style={({ pressed }) => [
                        {
                          backgroundColor: value ? colors.brandPrimary : colors.bgInput,
                          borderColor: value ? colors.brandPrimary : colors.borderDefault,
                          borderWidth: 1,
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                        },
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={{ color: value ? '#fff' : colors.textSecondary, fontWeight: '700', fontSize: 13 }}>
                        {value ? 'Ativado ✓' : 'Desativado'}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>

              {isEnabled && (
                <View style={{ marginTop: 12 }}>
                  <Controller
                    control={control}
                    name={`listings.${index}.price` as const}
                    render={({ field: { onChange, value } }) => (
                      <Field label="Preço de venda específico" icon="$" error={errors.listings?.[index]?.price?.message}>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          keyboardType="decimal-pad"
                          placeholder="0,00"
                          placeholderTextColor={colors.textTertiary}
                          style={[styles.input, errors.listings?.[index]?.price && styles.inputError]}
                        />
                      </Field>
                    )}
                  />
                </View>
              )}
            </View>
          );
        })}
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
