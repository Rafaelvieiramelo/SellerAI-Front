import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GeneratedProductAd } from '../domain/productAdTypes';

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
    marginTop: 18,
    gap: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    alignItems: 'center',
  },
  kicker: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  scoreBadge: {
    borderRadius: 999,
    backgroundColor: '#12385a',
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scoreBadgeText: {
    color: '#bae6fd',
    fontWeight: '900',
    fontSize: 13,
  },
  grid: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: '#203044',
    borderRadius: 18,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  cardLabel: {
    color: '#7dd3fc',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardValue: {
    color: '#f8fafc',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '800',
  },
  description: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  scoreText: {
    color: '#f8fafc',
    fontWeight: '900',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#1e293b',
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#22c55e',
  },
  scoreHint: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 10,
    lineHeight: 17,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyword: {
    borderRadius: 999,
    backgroundColor: '#172033',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  keywordText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '800',
  },
});
