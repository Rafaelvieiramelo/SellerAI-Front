import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const sizeConfig: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number; borderRadius: number }> = {
  sm: { height: 32, paddingHorizontal: spacing[3], fontSize: 13, borderRadius: radii.md },
  md: { height: 36, paddingHorizontal: spacing[4], fontSize: 14, borderRadius: radii.lg },
  lg: { height: 40, paddingHorizontal: spacing[5], fontSize: 14, borderRadius: radii.lg },
  xl: { height: 44, paddingHorizontal: spacing[6], fontSize: 16, borderRadius: radii.xl },
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const config = sizeConfig[size];

  const content = (
    <View style={[styles.content, fullWidth && styles.contentFull]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' || variant === 'ghost' ? colors.textSecondary : colors.white}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <Text style={[styles.icon, { color: getTextColor(variant) }]}>{icon}</Text>}
          <Text style={[styles.label, { color: getTextColor(variant), fontSize: config.fontSize }]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <Text style={[styles.icon, { color: getTextColor(variant) }]}>{icon}</Text>}
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          { borderRadius: config.borderRadius, overflow: 'hidden' },
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          pressed && !isDisabled && styles.pressed,
          style,
        ]}
      >
        <LinearGradient
          colors={isDisabled ? [colors.bgSurfaceActive, colors.bgSurfaceActive] : [colors.brandPrimary, colors.brandHover]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, { height: config.height, paddingHorizontal: config.paddingHorizontal }]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: config.height,
          paddingHorizontal: config.paddingHorizontal,
          borderRadius: config.borderRadius,
        },
        getVariantStyle(variant),
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

function getTextColor(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
      return colors.white;
    case 'secondary':
      return colors.textSecondary;
    case 'ghost':
      return colors.textSecondary;
    case 'danger':
      return colors.errorText;
    case 'success':
      return colors.successText;
    default:
      return colors.white;
  }
}

function getVariantStyle(variant: ButtonVariant): ViewStyle {
  switch (variant) {
    case 'secondary':
      return {
        borderWidth: 1,
        borderColor: colors.borderDefault,
        backgroundColor: 'transparent',
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
      };
    case 'danger':
      return {
        borderWidth: 1,
        borderColor: colors.error,
        backgroundColor: colors.errorSubtle,
      };
    case 'success':
      return {
        borderWidth: 1,
        borderColor: colors.success,
        backgroundColor: colors.successSubtle,
      };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  contentFull: {
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  icon: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
