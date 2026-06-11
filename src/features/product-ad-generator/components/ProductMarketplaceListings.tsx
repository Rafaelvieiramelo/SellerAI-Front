import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useMarketplaceListings } from '../presentation/hooks/useMarketplaceListings';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radii } from '../../../theme/radii';
import { typography } from '../../../theme/typography';
import { styles } from './ProductForm.styles';

interface ProductMarketplaceListingsProps {
  productId: string;
}

export function ProductMarketplaceListings({ productId }: ProductMarketplaceListingsProps) {
  const {
    listings,
    loading,
    publishing,
    error,
    success,
    publishListing,
  } = useMarketplaceListings(productId);

  const [marketplace, setMarketplace] = useState<'Shopee' | 'Mercado Livre'>('Shopee');
  const [externalId, setExternalId] = useState('');
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRegister = async () => {
    setValidationError(null);

    if (!externalId.trim()) {
      setValidationError('O ID Externo é obrigatório.');
      return;
    }

    if (!url.trim() || !url.startsWith('http')) {
      setValidationError('Insira uma URL de anúncio válida.');
      return;
    }

    try {
      await publishListing(marketplace, externalId.trim(), url.trim());
      setExternalId('');
      setUrl('');
    } catch {
      // O hook já gerencia o erro geral de API
    }
  };

  return (
    <View style={{ gap: spacing[5], marginTop: spacing[3] }}>
      <View style={[styles.section, { borderStyle: 'solid' }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.eyebrow}>Canais de Venda</Text>
          <Text style={styles.sectionTitle}>Registrar publicação</Text>
        </View>

        <View style={{ gap: spacing[4] }}>
          <View style={styles.inlineGrid}>
            <View style={styles.field}>
              <Text style={styles.label}>Marketplace</Text>
              <View style={styles.marketplaceSelectorRow}>
                {(['Shopee', 'Mercado Livre'] as const).map((mkt) => {
                  const isSelected = marketplace === mkt;
                  return (
                    <Pressable
                      key={mkt}
                      onPress={() => setMarketplace(mkt)}
                      style={[
                        styles.marketplaceBtn,
                        isSelected ? styles.marketplaceBtnSelected : styles.marketplaceBtnUnselected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.marketplaceBtnText,
                          isSelected ? styles.marketplaceBtnTextSelected : styles.marketplaceBtnTextUnselected,
                        ]}
                      >
                        {mkt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>ID Externo do Anúncio</Text>
              <TextInput
                value={externalId}
                onChangeText={setExternalId}
                placeholder="Ex: MLB1234567 ou SHP-987"
                placeholderTextColor={colors.textTertiary}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Link do Anúncio (URL)</Text>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="https://shopee.com.br/meu-anuncio..."
              placeholderTextColor={colors.textTertiary}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          {validationError || error ? (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {validationError ?? error}
            </Text>
          ) : null}

          {success ? (
            <Text style={{ ...typography.caption, color: colors.success, fontWeight: '700' }}>
              ✓ {success}
            </Text>
          ) : null}

          <Pressable
            onPress={handleRegister}
            disabled={publishing}
            style={({ pressed }) => [
              styles.addVariationBtn,
              {
                backgroundColor: colors.brandPrimary,
                borderColor: colors.brandPrimary,
                borderStyle: 'solid',
              },
              pressed && styles.pressed,
            ]}
          >
            {publishing ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={[styles.addVariationText, { color: colors.white }]}>
                Vincular Canal de Venda
              </Text>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.eyebrow}>Anúncios Ativos</Text>
          <Text style={styles.sectionTitle}>Publicações Vinculadas</Text>
        </View>

        {loading ? (
          <View style={{ padding: spacing[4], alignItems: 'center' }}>
            <ActivityIndicator color={colors.brandPrimary} />
            <Text style={{ ...typography.caption, color: colors.textTertiary, marginTop: spacing[2] }}>
              Buscando canais ativos...
            </Text>
          </View>
        ) : listings.length === 0 ? (
          <View style={{ padding: spacing[6], alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: radii.xl }}>
            <Text style={{ fontSize: 28, marginBottom: spacing[2] }}>📡</Text>
            <Text style={{ ...typography.body, color: colors.textSecondary, fontWeight: '800' }}>
              Nenhum canal de venda vinculado
            </Text>
            <Text style={{ ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginTop: spacing[1] }}>
              Vincule este produto a uma publicação da Shopee ou Mercado Livre acima.
            </Text>
          </View>
        ) : (
          <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
            {listings.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: spacing[3],
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderDefault,
                }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                    <Text style={{ ...typography.body, fontWeight: '900', color: colors.textPrimary }}>
                      {item.marketplace}
                    </Text>
                    <View
                      style={{
                        backgroundColor: colors.successSubtle,
                        borderRadius: radii.full,
                        paddingHorizontal: spacing[2],
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '900', color: colors.success }}>
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ ...typography.caption, color: colors.textTertiary }}>
                    ID: {item.externalId}
                  </Text>
                </View>

                {Platform.OS === 'web' ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecorationLine: 'none',
                      color: colors.brandText,
                      fontWeight: '800',
                      fontSize: 13,
                      padding: spacing[2],
                      backgroundColor: colors.brandSubtle,
                      borderRadius: radii.lg,
                    } as any}
                  >
                    Ver Anúncio 🔗
                  </a>
                ) : (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        padding: spacing[2],
                        backgroundColor: colors.brandSubtle,
                        borderRadius: radii.lg,
                      },
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={{ color: colors.brandText, fontWeight: '800', fontSize: 13 }}>
                      Acessar 🔗
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
