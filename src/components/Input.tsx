import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';

type InputVariant = 'default' | 'filled' | 'flushed';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  variant?: InputVariant;
  size?: InputSize;
  containerStyle?: ViewStyle;
}

const sizeConfig: Record<InputSize, { height: number; paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { height: 32, paddingVertical: spacing[2], paddingHorizontal: spacing[3], fontSize: 13 },
  md: { height: 36, paddingVertical: spacing[2] + 2, paddingHorizontal: spacing[4], fontSize: 14 },
  lg: { height: 40, paddingVertical: spacing[3], paddingHorizontal: spacing[4], fontSize: 14 },
};

export function Input({
  label,
  error,
  helper,
  variant = 'default',
  size = 'md',
  containerStyle,
  ...textInputProps
}: InputProps) {
  const config = sizeConfig[size];
  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            height: config.height,
            paddingVertical: config.paddingVertical,
            paddingHorizontal: config.paddingHorizontal,
            fontSize: config.fontSize,
          },
          variant === 'filled' && styles.inputFilled,
          variant === 'flushed' && styles.inputFlushed,
          hasError && styles.inputError,
          textInputProps.editable === false && styles.inputDisabled,
        ]}
        placeholderTextColor={colors.textTertiary}
        {...textInputProps}
      />
      {hasError && <Text style={styles.error}>{error}</Text>}
      {!hasError && helper && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  label: {
    ...typography.bodySm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.lg,
    backgroundColor: colors.bgInput,
    color: colors.textPrimary,
    ...typography.body,
  },
  inputFilled: {
    borderWidth: 0,
    backgroundColor: colors.bgSurface,
  },
  inputFlushed: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  error: {
    ...typography.caption,
    color: colors.errorText,
    fontWeight: '500',
  },
  helper: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
