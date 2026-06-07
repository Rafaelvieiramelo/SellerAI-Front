import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radii } from '../../../theme/radii';

interface VisualOptionSelectorProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  columns?: number;
  compact?: boolean;
}

export function VisualOptionSelector<T extends string>({
  options,
  value,
  onChange,
  compact,
}: VisualOptionSelectorProps<T>) {
  return (
    <View style={styles.grid}>
      {options.map((option) => {
        const selected = option === value;

        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={({ pressed }) => [
              styles.option,
              compact && styles.optionCompact,
              selected && styles.optionSelected,
              pressed && styles.optionPressed,
            ]}
          >
            <View style={[styles.dot, selected && styles.dotSelected]} />
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2] + 2,
  },
  option: {
    minHeight: 62,
    minWidth: 112,
    flexGrow: 1,
    flexBasis: '30%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl + 2,
    backgroundColor: colors.bgInput,
    padding: spacing[3] + 2,
  },
  optionCompact: {
    minHeight: 52,
    flexBasis: '28%',
  },
  optionSelected: {
    borderColor: colors.brandText,
    backgroundColor: colors.brandSubtle,
  },
  optionPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.88,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textDisabled,
    marginBottom: spacing[2],
  },
  dotSelected: {
    width: 20,
    backgroundColor: colors.brandText,
  },
  optionText: {
    ...typography.body,
    color: colors.textTertiary,
    fontWeight: '800',
  },
  optionTextSelected: {
    color: colors.textPrimary,
  },
});
