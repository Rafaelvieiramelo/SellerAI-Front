import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radii } from '../../../theme/radii';
import { shadows } from '../../../theme/shadows';

export const styles = StyleSheet.create({
  form: {
    gap: spacing[6],
  },
  section: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgSurface,
    padding: spacing[6],
    ...shadows.sm,
  },
  sectionHeader: {
    marginBottom: spacing[4],
  },
  eyebrow: {
    ...typography.overline,
    color: colors.brandText,
    fontWeight: '900',
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '900',
    marginTop: spacing[1],
  },
  sectionBody: {
    gap: spacing[5],
  },
  inlineGrid: {
    gap: spacing[4],
    ...Platform.select({
      web: {
        flexDirection: 'row',
      },
    }),
  },
  priceGrid: {
    gap: spacing[5],
    ...Platform.select({
      web: {
        flexDirection: 'row',
      },
    }),
  },
  field: {
    gap: spacing[2],
    ...Platform.select({
      web: {
        flex: 1,
      },
    }),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  labelIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: colors.brandSubtle,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
  },
  labelIconText: {
    color: colors.brandText,
    fontSize: 11,
    fontWeight: '900',
  },
  label: {
    ...typography.bodySm,
    color: colors.textSecondary,
    fontWeight: '800',
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgInput,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: spacing[4],
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.errorText,
    fontWeight: '700',
  },
  marginPanel: {
    minHeight: 72,
    borderRadius: radii.xl + 2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    padding: spacing[3] + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  marginLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  marginHint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 3,
    fontWeight: '600',
  },
  marginBadge: {
    minWidth: 64,
    alignItems: 'center',
    borderRadius: radii.full,
    backgroundColor: colors.errorSubtle,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  marginBadgeGood: {
    backgroundColor: colors.successSubtle,
  },
  marginBadgeText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  submit: {
    borderRadius: radii['2xl'],
    overflow: 'hidden',
    marginTop: spacing[1],
    marginBottom: spacing[4],
  },
  submitPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  submitGradient: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2] + 2,
    paddingHorizontal: spacing[4] + 2,
  },
  submitText: {
    color: colors.white,
    ...typography.h3,
    fontWeight: '900',
  },
  cancelButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl + 2,
    marginTop: -spacing[2],
    marginBottom: spacing[4],
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '900',
  },
  dropdownContainer: {
    position: 'relative',
    width: '100%',
  },
  dropdownWrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 10,
  },
  dropdownTrigger: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii['2xl'],
    backgroundColor: colors.bgInput,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  dropdownArrow: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  dropdownArrowWeb: {
    color: colors.textTertiary,
    fontSize: 11,
    position: 'absolute',
    right: 16,
    top: 22,
    pointerEvents: 'none',
  },
  dropdownOptionsList: {
    marginTop: spacing[1],
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl,
    backgroundColor: colors.bgSurface,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownOption: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.brandSubtle,
  },
  dropdownOptionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownOptionTextSelected: {
    color: colors.brandText,
    fontWeight: '800',
  },
  marketplaceSelectorRow: {
    flexDirection: 'row',
    gap: spacing[3],
    width: '100%',
  },
  marketplaceBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  marketplaceBtnSelected: {
    borderColor: colors.brandText,
    backgroundColor: colors.brandSubtle,
  },
  marketplaceBtnUnselected: {
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgInput,
  },
  marketplaceBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  marketplaceBtnTextSelected: {
    color: colors.brandText,
  },
  marketplaceBtnTextUnselected: {
    color: colors.textSecondary,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  variationCard: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.xl,
    backgroundColor: colors.bgInput,
    padding: spacing[4],
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  variationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    paddingBottom: spacing[2],
  },
  variationCardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  removeVariationBtn: {
    padding: spacing[1],
  },
  removeVariationText: {
    fontSize: 16,
  },
  addVariationBtn: {
    minHeight: 48,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.brandPrimary,
    backgroundColor: colors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
  },
  addVariationText: {
    color: colors.brandText,
    fontWeight: '800',
    fontSize: 14,
  },
});
