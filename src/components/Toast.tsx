import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const DISMISS_MS: Record<ToastType, number> = {
  success: 4000,
  error: 6000,
  warning: 6000,
  info: 8000,
};

const typeConfig: Record<ToastType, { icon: string; borderColor: string }> = {
  success: { icon: '✓', borderColor: colors.success },
  error: { icon: '✕', borderColor: colors.error },
  warning: { icon: '⚠', borderColor: colors.warning },
  info: { icon: 'ℹ', borderColor: colors.brandPrimary },
};

const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const fadeAnims = useRef<Map<string, Animated.Value>>(new Map());

  const removeToast = useCallback((id: string) => {
    const anim = fadeAnims.current.get(id);
    if (anim) {
      Animated.timing(anim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        fadeAnims.current.delete(id);
      });
    } else {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  const toast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const anim = new Animated.Value(0);
      fadeAnims.current.set(id, anim);

      setToasts((prev) => {
        const next = [...prev, { id, type, title, message }];
        return next.length > MAX_VISIBLE ? next.slice(-MAX_VISIBLE) : next;
      });

      Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();

      const duration = DISMISS_MS[type];
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  const ctx = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((item) => {
          const anim = fadeAnims.current.get(item.id) ?? new Animated.Value(1);
          const cfg = typeConfig[item.type];

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.toast,
                { borderLeftColor: cfg.borderColor, opacity: anim },
              ]}
            >
              <Text style={[styles.icon, { color: cfg.borderColor }]}>{cfg.icon}</Text>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                {item.message && <Text style={styles.message}>{item.message}</Text>}
              </View>
            </Animated.View>
          );
        })}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 16 : 60,
    right: 16,
    left: Platform.OS === 'web' ? undefined : 16,
    zIndex: 9999,
    gap: spacing[3],
    alignItems: Platform.OS === 'web' ? 'flex-end' : 'stretch',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderLeftWidth: 3,
    borderRadius: radii.lg,
    padding: spacing[3],
    maxWidth: 400,
    width: '100%',
    ...shadows.md,
  },
  icon: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.bodySm,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  message: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
