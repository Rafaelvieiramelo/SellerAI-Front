import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  web: '"Inter", -apple-system, system-ui, sans-serif',
  android: 'Roboto',
  ios: 'System',
});

export const typography = {
  fontFamily,

  display: {
    fontFamily,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700' as TextStyle['fontWeight'],
  },

  h1: {
    fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
  },

  h2: {
    fontFamily,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as TextStyle['fontWeight'],
  },

  h3: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
  },

  bodyLg: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as TextStyle['fontWeight'],
  },

  body: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
  },

  bodySm: {
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as TextStyle['fontWeight'],
  },

  caption: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
  },

  overline: {
    fontFamily,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },

  mono: {
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
} as const;
