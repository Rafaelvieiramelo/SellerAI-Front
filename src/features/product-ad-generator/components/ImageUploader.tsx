import React from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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
    borderColor: '#38bdf8',
    borderRadius: 22,
    backgroundColor: '#0d1b2c',
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
    padding: 22,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12385a',
    borderWidth: 1,
    borderColor: '#1d9bf0',
    marginBottom: 14,
  },
  iconText: {
    color: '#bfdbfe',
    fontWeight: '900',
    fontSize: 13,
  },
  title: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center',
  },
  previewShell: {
    padding: 12,
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: '#111827',
  },
  removeButton: {
    position: 'absolute',
    right: 22,
    top: 22,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  removeButtonText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '900',
  },
  aiNote: {
    borderTopWidth: 1,
    borderTopColor: '#17324d',
    padding: 14,
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
  },
  aiNoteText: {
    color: '#7dd3fc',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
