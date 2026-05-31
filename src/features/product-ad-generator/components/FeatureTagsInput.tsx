import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, TextInput, UIManager, View } from 'react-native';

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
            placeholderTextColor="#718096"
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
    borderColor: '#203044',
    borderRadius: 18,
    backgroundColor: '#0f172a',
    padding: 10,
  },
  inputShellError: {
    borderColor: '#fb7185',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#12283f',
    borderWidth: 1,
    borderColor: '#1d9bf0',
    paddingHorizontal: 12,
  },
  tagPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.82,
  },
  tagText: {
    color: '#dbeafe',
    fontSize: 13,
    fontWeight: '700',
  },
  removeText: {
    color: '#93c5fd',
    fontSize: 15,
    fontWeight: '900',
  },
  input: {
    minWidth: 190,
    flexGrow: 1,
    height: 44,
    color: '#f8fafc',
    fontSize: 15,
    paddingHorizontal: 4,
  },
  helperRow: {
    gap: 4,
    marginTop: 8,
  },
  helperText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    color: '#fb7185',
    fontSize: 12,
    fontWeight: '700',
  },
});
