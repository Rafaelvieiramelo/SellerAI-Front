import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'status';
  padding?: number;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = spacing[5],
  onPress,
  style,
  testID,
}: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => [
          styles.base,
          variant === 'interactive' && styles.interactive,
          pressed && variant === 'interactive' && styles.interactivePressed,
          { padding },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View testID={testID} style={[styles.base, { padding }, style]}>
      {children}
    </View>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      {icon && <Text style={styles.statIcon}>{icon}</Text>}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl,
    backgroundColor: colors.bgSurface,
    gap: spacing[4],
  },
  interactive: {
    ...shadows.sm,
  },
  interactivePressed: {
    backgroundColor: colors.bgSurfaceHover,
    borderColor: colors.borderStrong,
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  headerText: {
    flex: 1,
    gap: spacing[1],
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.bodySm,
    color: colors.textTertiary,
  },
  statCard: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl,
    backgroundColor: colors.bgSurface,
    padding: spacing[4],
    gap: spacing[1],
  },
  statIcon: {
    fontSize: 16,
    marginBottom: spacing[1],
  },
  statValue: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
