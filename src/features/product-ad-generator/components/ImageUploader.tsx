import React from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radii } from '../../../theme/radii';

interface ImageUploaderProps {
  value?: string;
  onChange: (uri?: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso às imagens para criar o preview.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <Pressable onPress={pickImage} style={({ pressed }) => [styles.upload, pressed && styles.uploadPressed]}>
      {value ? (
        <View style={styles.previewShell}>
          <Image source={{ uri: value }} style={styles.preview} />
          <Pressable onPress={() => onChange(undefined)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remover</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>IMG</Text>
          </View>
          <Text style={styles.title}>{Platform.OS === 'web' ? 'Clique ou arraste uma imagem' : 'Selecionar imagem'}</Text>
          <Text style={styles.subtitle}>Preview instantâneo para deixar o anúncio mais rico.</Text>
        </View>
      )}

      <View style={styles.aiNote}>
        <Text style={styles.aiNoteText}>Em breve a IA poderá analisar automaticamente suas imagens.</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  upload: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.brandText,
    borderRadius: radii['2xl'] + 2,
    backgroundColor: colors.bgSurface,
    overflow: 'hidden',
  },
  uploadPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.9,
  },
  emptyState: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[5] + 2,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: radii.xl + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSubtle,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    marginBottom: spacing[3] + 2,
  },
  iconText: {
    color: colors.brandText,
    fontWeight: '900',
    fontSize: 13,
  },
  title: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.textTertiary,
    lineHeight: 19,
    marginTop: spacing[1],
    textAlign: 'center',
  },
  previewShell: {
    padding: spacing[3],
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgSurface,
  },
  removeButton: {
    position: 'absolute',
    right: spacing[5] + 2,
    top: spacing[5] + 2,
    borderRadius: radii.full,
    backgroundColor: colors.bgOverlay,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  removeButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  aiNote: {
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    padding: spacing[3] + 2,
    backgroundColor: colors.brandSubtle,
    opacity: 0.6,
  },
  aiNoteText: {
    ...typography.caption,
    color: colors.brandText,
    fontWeight: '700',
    textAlign: 'center',
  },
});
