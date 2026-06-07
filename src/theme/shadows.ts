import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;

function createShadow(level: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): ShadowStyle {
  if (Platform.OS === 'android') {
    const elevationMap: Record<string, number> = {
      xs: 1,
      sm: 2,
      md: 4,
      lg: 8,
      xl: 12,
    };
    return { elevation: elevationMap[level] };
  }

  const shadowMap: Record<string, { opacity: number; radius: number; offset: { width: number; height: number } }> = {
    xs: { opacity: 0.2, radius: 2, offset: { width: 0, height: 1 } },
    sm: { opacity: 0.25, radius: 3, offset: { width: 0, height: 1 } },
    md: { opacity: 0.3, radius: 6, offset: { width: 0, height: 4 } },
    lg: { opacity: 0.35, radius: 15, offset: { width: 0, height: 10 } },
    xl: { opacity: 0.4, radius: 25, offset: { width: 0, height: 20 } },
  };

  const s = shadowMap[level];

  return {
    shadowColor: '#000000',
    shadowOffset: s.offset,
    shadowOpacity: s.opacity,
    shadowRadius: s.radius,
  };
}

export const shadows = {
  xs: createShadow('xs'),
  sm: createShadow('sm'),
  md: createShadow('md'),
  lg: createShadow('lg'),
  xl: createShadow('xl'),
} as const;
