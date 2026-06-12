import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Product } from '../domain/models/Product';
import { getGeneratedProductFields, formatDate, formatPrice } from '../utils/productMappers';
import { styles } from '../screens/ProductAdGeneratorScreen.styles';
import { ProductMarketplaceListings } from './ProductMarketplaceListings';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
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
                <Text style={styles.generatedLabel}>SKU</Text>
                <Text style={styles.generatedValue}>{product.sku || 'N/A'}</Text>
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
                <Text style={styles.generatedLabel}>Estoque Central</Text>
                <Text style={styles.generatedValue}>{product.stockQuantity ?? 0} unid.</Text>
              </View>
              <View style={styles.detailsModalHalfField}>
                <Text style={styles.generatedLabel}>Preço de Custo</Text>
                <Text style={styles.generatedValue}>{formatPrice(product.costPrice)}</Text>
              </View>
            </View>

            <ProductMarketplaceListings productId={product.id} />
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
