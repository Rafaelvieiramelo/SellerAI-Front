import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { styles } from '../screens/ProductAdGeneratorScreen.styles';

interface ErrorModalProps {
  message: string | null;
  onClose: () => void;
}

export function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <Modal visible={Boolean(message)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nao foi possivel gerar o anuncio</Text>
          <Text style={styles.modalText}>{message}</Text>
          <Pressable onPress={onClose} style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
