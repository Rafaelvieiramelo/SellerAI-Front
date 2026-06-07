import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GeneratedProductAd } from '../domain/productAdTypes';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radii } from '../../../theme/radii';

interface SeoPreviewCardProps {
  result: GeneratedProductAd;
}

export function SeoPreviewCard({ result }: SeoPreviewCardProps) {
  return (
    <View style={styles.preview}>
      <View style={styles.previewHeader}>
        <View>
          <Text style={styles.kicker}>Preview gerado</Text>
          <Text style={styles.title}>Anúncio pronto para revisar</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>{result.seoScore}/100</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Título SEO</Text>
          <Text style={styles.cardValue}>{result.seoTitle}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Descrição do produto</Text>
          <Text style={styles.description}>{result.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Hashtags</Text>
          <Text style={styles.cardValue}>{result.hashtags.join('  ')}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.scoreRow}>
            <Text style={styles.cardLabel}>SEO Score</Text>
            <Text style={styles.scoreText}>{result.seoScore}/100</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${result.seoScore}%` }]} />
          </View>
          <Text style={styles.scoreHint}>Score fictício baseado em características, título, clareza e keywords.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Palavras-chave</Text>
          <View style={styles.keywords}>
            {result.keywords.map((keyword) => (
              <View key={keyword} style={styles.keyword}>
                <Text style={styles.keywordText}>{keyword}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    marginTop: spacing[4] + 2,
    gap: spacing[4],
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[3] + 2,
    alignItems: 'center',
  },
  kicker: {
    ...typography.overline,
    color: colors.brandText,
    fontWeight: '900',
  },
  title: {
    ...typography.h1,
    color: colors.white,
    fontWeight: '900',
    marginTop: spacing[1],
  },
  scoreBadge: {
    borderRadius: radii.full,
    backgroundColor: colors.brandSubtle,
    borderWidth: 1,
    borderColor: colors.brandText,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  scoreBadgeText: {
    color: colors.brandText,
    fontWeight: '900',
    fontSize: 13,
  },
  grid: {
    gap: spacing[3],
  },
  card: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl + 2,
    backgroundColor: colors.bgInput,
    padding: spacing[4],
  },
  cardLabel: {
    ...typography.overline,
    color: colors.brandText,
    fontWeight: '900',
    marginBottom: spacing[2],
  },
  cardValue: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    lineHeight: 23,
    fontWeight: '800',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  scoreText: {
    color: colors.textPrimary,
    fontWeight: '900',
  },
  progressTrack: {
    height: 10,
    borderRadius: radii.full,
    backgroundColor: colors.bgSurfaceActive,
    overflow: 'hidden',
    marginTop: spacing[1],
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.success,
  },
  scoreHint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing[2] + 2,
    lineHeight: 17,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  keyword: {
    borderRadius: radii.full,
    backgroundColor: colors.bgSurfaceActive,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: spacing[2] + 2,
    paddingVertical: spacing[1],
  },
  keywordText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '800',
  },
});
