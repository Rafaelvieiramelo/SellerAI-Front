import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radii } from '../../../theme/radii';

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
        <LinearGradient colors={[colors.bgInput, colors.bgSurface]} style={styles.card}>
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
    backgroundColor: colors.bgOverlay,
    padding: spacing[6],
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderRadius: radii['2xl'] + 4,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[6] + 4,
  },
  orbit: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    backgroundColor: colors.brandPrimary,
    marginBottom: spacing[4] + 2,
  },
  orbitText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 22,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.textTertiary,
    lineHeight: 20,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.bgSurfaceActive,
    marginTop: spacing[5] + 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '74%',
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.brandText,
  },
});
