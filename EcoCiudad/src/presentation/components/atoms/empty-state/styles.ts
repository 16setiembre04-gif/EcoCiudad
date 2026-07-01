import { type ViewStyle, type TextStyle } from 'react-native';
import { type ThemeColors } from '@/theme';
import { spacing } from '@/theme/spacing';
import { textStyles } from '@/theme/typography';

export const getEmptyStateStyles = (colors: ThemeColors) => ({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  } as ViewStyle,
  iconContainer: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  title: {
    ...textStyles.title,
    color: colors.textPrimary,
    textAlign: 'center' as const,
    marginBottom: spacing.sm,
  } as TextStyle,
  description: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: spacing.xl,
    lineHeight: textStyles.body.lineHeight * 1.5,
  } as TextStyle,
  actionContainer: {
    marginTop: spacing.md,
  } as ViewStyle,
});
