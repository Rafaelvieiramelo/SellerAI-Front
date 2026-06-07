import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface DialogProps {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
  onClose: () => void;
  actions?: React.ReactNode;
}

const sizeMap: Record<ModalSize, number> = {
  sm: 400,
  md: 480,
  lg: 640,
  xl: 800,
};

export function Dialog({ visible, title, children, size = 'md', onClose, actions }: DialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.container, { maxWidth: sizeMap[size] }]} onPress={(e) => e.stopPropagation()}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>

          <Text style={styles.title}>{title}</Text>

          <View style={styles.body}>{children}</View>

          {actions && (
            <>
              <View style={styles.divider} />
              <View style={styles.actions}>{actions}</View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog visible={visible} title={title} onClose={onCancel} actions={
      <>
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
        </Pressable>
        <Pressable
          style={[styles.confirmBtn, variant === 'danger' && styles.confirmBtnDanger]}
          onPress={onConfirm}
        >
          <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
        </Pressable>
      </>
    }>
      <Text style={styles.message}>{message}</Text>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgOverlay,
    padding: spacing[5],
    ...Platform.select({
      web: { backdropFilter: 'blur(4px)' } as any,
      default: null,
    }),
  },
  container: {
    width: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[6],
    gap: spacing[4],
    ...shadows.lg,
  },
  closeButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    width: 28,
    height: 28,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.textTertiary,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    paddingRight: spacing[6],
  },
  body: {
    gap: spacing[3],
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3],
  },
  cancelBtn: {
    paddingHorizontal: spacing[4],
    height: 36,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  confirmBtn: {
    paddingHorizontal: spacing[4],
    height: 36,
    borderRadius: radii.lg,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDanger: {
    backgroundColor: colors.error,
  },
  confirmBtnText: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '600',
  },
});
