import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
    gap: 10,
  },
  option: {
    minHeight: 62,
    minWidth: 112,
    flexGrow: 1,
    flexBasis: '30%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#203044',
    borderRadius: 18,
    backgroundColor: '#0f172a',
    padding: 14,
  },
  optionCompact: {
    minHeight: 52,
    flexBasis: '28%',
  },
  optionSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#10243a',
  },
  optionPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.88,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#475569',
    marginBottom: 8,
  },
  dotSelected: {
    width: 20,
    backgroundColor: '#38bdf8',
  },
  optionText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '800',
  },
  optionTextSelected: {
    color: '#f8fafc',
  },
});
