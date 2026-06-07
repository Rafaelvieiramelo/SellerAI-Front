import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { spacing } from '../theme/spacing';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'brand';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; textColor: string }> = {
  default: { bg: colors.bgSurfaceActive, textColor: colors.textSecondary },
  success: { bg: colors.successSubtle, textColor: colors.successText },
  error: { bg: colors.errorSubtle, textColor: colors.errorText },
  warning: { bg: colors.warningSubtle, textColor: colors.warningText },
  info: { bg: colors.infoSubtle, textColor: colors.infoText },
  brand: { bg: colors.brandSubtle, textColor: colors.brandText },
};

export function Badge({ label, variant = 'default', size = 'md', style }: BadgeProps) {
  const vs = variantStyles[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: vs.bg },
        isSmall && styles.small,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: vs.textColor },
          isSmall && styles.labelSmall,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  small: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  label: {
    ...typography.overline,
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontSize: 10,
    lineHeight: 14,
  },
});
