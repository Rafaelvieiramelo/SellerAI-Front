import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, TextInput, UIManager, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radii } from '../../../theme/radii';

interface FeatureTagsInputProps {
  value: string[];
  onChange: (features: string[]) => void;
  error?: string;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function FeatureTagsInput({ value, onChange, error }: FeatureTagsInputProps) {
  const [draft, setDraft] = useState('');

  const addFeature = () => {
    const nextFeature = draft.trim();

    if (!nextFeature || value.some((feature) => feature.toLowerCase() === nextFeature.toLowerCase())) {
      setDraft('');
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange([...value, nextFeature]);
    setDraft('');
  };

  const removeFeature = (featureToRemove: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(value.filter((feature) => feature !== featureToRemove));
  };

  return (
    <View>
      <View style={[styles.inputShell, error && styles.inputShellError]}>
        <View style={styles.tagsWrap}>
          {value.map((feature) => (
            <Pressable
              key={feature}
              onPress={() => removeFeature(feature)}
              style={({ pressed }) => [styles.tag, pressed && styles.tagPressed]}
            >
              <Text style={styles.tagText}>{feature}</Text>
              <Text style={styles.removeText}>x</Text>
            </Pressable>
          ))}

          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={addFeature}
            blurOnSubmit={false}
            placeholder={value.length ? 'Adicionar outra...' : 'Digite e pressione Enter. Ex: Bluetooth 5.3'}
            placeholderTextColor={colors.textDisabled}
            style={styles.input}
            returnKeyType="done"
          />
        </View>
      </View>
      <View style={styles.helperRow}>
        <Text style={styles.helperText}>{value.length ? `${value.length} características adicionadas` : 'Contexto forte gera anúncios melhores.'}</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputShell: {
    minHeight: 70,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl + 2,
    backgroundColor: colors.bgInput,
    padding: spacing[2] + 2,
  },
  inputShellError: {
    borderColor: colors.error,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing[2],
  },
  tag: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderRadius: radii.full,
    backgroundColor: colors.brandSubtle,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    paddingHorizontal: spacing[3],
  },
  tagPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.82,
  },
  tagText: {
    ...typography.bodySm,
    color: colors.brandText,
    fontWeight: '700',
  },
  removeText: {
    color: colors.brandText,
    fontSize: 15,
    fontWeight: '900',
  },
  input: {
    minWidth: 190,
    flexGrow: 1,
    height: 44,
    color: colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: 4,
  },
  helperRow: {
    gap: spacing[1],
    marginTop: spacing[2],
  },
  helperText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  errorText: {
    ...typography.caption,
    color: colors.errorText,
    fontWeight: '700',
  },
});
