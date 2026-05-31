import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  const pulse = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 620, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.7, duration: 620, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse, visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <LinearGradient colors={['#0f172a', '#111827']} style={styles.card}>
          <Animated.View style={[styles.orbit, { opacity: pulse, transform: [{ scale: pulse }] }]}>
            <Text style={styles.orbitText}>AI</Text>
          </Animated.View>
          <Text style={styles.title}>Gerando anúncio...</Text>
          <Text style={styles.subtitle}>Organizando contexto, keywords e copy de venda.</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { opacity: pulse }]} />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#243449',
    padding: 28,
  },
  orbit: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#0ea5e9',
    marginBottom: 18,
  },
  orbitText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 22,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#1e293b',
    marginTop: 22,
    overflow: 'hidden',
  },
  progressFill: {
    width: '74%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#38bdf8',
  },
});
