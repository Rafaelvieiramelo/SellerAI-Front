import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';
import { spacing } from '../../../../theme/spacing';
import { radii } from '../../../../theme/radii';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  webContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  visualPane: {
    flex: 1.2,
    justifyContent: 'center',
    padding: spacing[12],
    position: 'relative',
    overflow: 'hidden',
    borderRightWidth: 1,
    borderRightColor: colors.borderDefault,
  },
  glowOverlay1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    ...Platform.select({
      web: { filter: 'blur(80px)' },
      default: null,
    }),
  },
  glowOverlay2: {
    position: 'absolute',
    bottom: -150,
    right: -100,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    ...Platform.select({
      web: { filter: 'blur(100px)' },
      default: null,
    }),
  },
  visualContent: {
    maxWidth: 480,
    alignSelf: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' },
      default: null,
    }),
  },
  logoBadgeText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  visualTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -1,
  },
  visualSubtitle: {
    color: colors.textSecondary,
    fontSize: 24,
    lineHeight: 34,
    fontWeight: '800',
    marginTop: spacing[2],
    marginBottom: spacing[8],
  },
  benefitsList: {
    gap: spacing[4],
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  checkIcon: {
    color: '#3B82F6',
    fontWeight: '900',
    fontSize: 16,
  },
  benefitText: {
    color: colors.textSecondary,
    ...typography.bodyLg,
    fontWeight: '600',
  },
  formPane: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
    padding: spacing[8],
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
  },
  desktopCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii['2xl'],
    padding: spacing[8],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    ...Platform.select({
      web: { boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)' },
      default: null,
    }),
  },
  mobileContainer: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: spacing[6],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing[4],
    marginBottom: spacing[6],
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  badgeText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -1,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing[2],
    lineHeight: 22,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii['2xl'],
    padding: spacing[6] + 4,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    marginBottom: spacing[10],
  },
  cardTitle: {
    ...typography.h2,
    marginBottom: spacing[6],
    color: colors.white,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: spacing[5],
  },
  label: {
    ...typography.bodySm,
    color: colors.textTertiary,
    marginBottom: spacing[2],
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: spacing[4],
    height: 48,
    ...Platform.select({
      web: { transition: 'all 200ms ease' },
      default: null,
    }),
  },
  inputWrapperFocused: {
    borderColor: '#3B82F6',
    ...Platform.select({
      web: { boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)' },
      default: null,
    }),
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  inputFieldIcon: {
    fontSize: 16,
    marginRight: spacing[3],
    color: colors.textTertiary,
  },
  textInputStyle: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    fontSize: 15,
    ...Platform.select({
      web: { outlineStyle: 'none' },
      default: null,
    }),
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing[1],
    fontWeight: '600',
  },
  submitButton: {
    marginTop: spacing[2],
  },
  link: {
    alignItems: 'center',
    marginTop: spacing[5],
  },
  linkText: {
    color: colors.textTertiary,
    ...typography.body,
  },
  linkBold: {
    color: colors.brandPrimary,
    fontWeight: '700',
  },
});
