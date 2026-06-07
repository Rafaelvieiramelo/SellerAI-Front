import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/features/auth/presentation/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ToastProvider } from './src/components/Toast';
import { colors } from './src/theme/colors';

export default function App() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const root = document.getElementById('root');
    const previous = {
      htmlHeight: document.documentElement.style.height,
      htmlMinHeight: document.documentElement.style.minHeight,
      htmlOverflow: document.documentElement.style.overflow,
      htmlBackgroundColor: document.documentElement.style.backgroundColor,
      htmlBackgroundImage: document.documentElement.style.backgroundImage,
      bodyHeight: document.body.style.height,
      bodyMinHeight: document.body.style.minHeight,
      bodyMargin: document.body.style.margin,
      bodyOverflow: document.body.style.overflow,
      bodyBackgroundColor: document.body.style.backgroundColor,
      bodyBackgroundImage: document.body.style.backgroundImage,
      rootHeight: root?.style.height,
      rootMinHeight: root?.style.minHeight,
      rootOverflow: root?.style.overflow,
      rootBackgroundColor: root?.style.backgroundColor,
    };

    const appBackground = `linear-gradient(180deg, ${colors.bgPrimary} 0%, #0f172a 48%, ${colors.bgSurface} 100%)`;

    document.documentElement.style.height = '100%';
    document.documentElement.style.minHeight = '100%';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.backgroundColor = colors.bgPrimary;
    document.documentElement.style.backgroundImage = appBackground;

    document.body.style.height = '100%';
    document.body.style.minHeight = '100%';
    document.body.style.margin = '0';
    document.body.style.overflow = 'auto';
    document.body.style.backgroundColor = colors.bgPrimary;
    document.body.style.backgroundImage = appBackground;

    if (root) {
      root.style.minHeight = '100%';
      root.style.overflow = 'visible';
      root.style.backgroundColor = colors.bgPrimary;
    }

    return () => {
      document.documentElement.style.height = previous.htmlHeight;
      document.documentElement.style.minHeight = previous.htmlMinHeight;
      document.documentElement.style.overflow = previous.htmlOverflow;
      document.documentElement.style.backgroundColor = previous.htmlBackgroundColor;
      document.documentElement.style.backgroundImage = previous.htmlBackgroundImage;
      document.body.style.height = previous.bodyHeight;
      document.body.style.minHeight = previous.bodyMinHeight;
      document.body.style.margin = previous.bodyMargin;
      document.body.style.overflow = previous.bodyOverflow;
      document.body.style.backgroundColor = previous.bodyBackgroundColor;
      document.body.style.backgroundImage = previous.bodyBackgroundImage;

      if (root) {
        root.style.height = previous.rootHeight ?? '';
        root.style.minHeight = previous.rootMinHeight ?? '';
        root.style.overflow = previous.rootOverflow ?? '';
        root.style.backgroundColor = previous.rootBackgroundColor ?? '';
      }
    };
  }, []);

  return (
    <View style={styles.appRoot}>
      <ToastProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ToastProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    minHeight: 0,
    ...Platform.select({
      web: {
        minHeight: '100%',
        backgroundColor: colors.bgPrimary,
      },
      default: null,
    }),
  },
});
