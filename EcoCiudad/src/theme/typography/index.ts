export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fontSize: {
    caption: 12,
    bodySmall: 14,
    body: 16,
    button: 16,
    subtitle: 20,
    title: 24,
    headline: 28,
    displayLarge: 32,
  },
  lineHeight: {
    caption: 16,
    bodySmall: 20,
    body: 24,
    button: 24,
    subtitle: 28,
    title: 32,
    headline: 36,
    displayLarge: 40,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const textStyles = {
  displayLarge: {
    fontSize: typography.fontSize.displayLarge,
    lineHeight: typography.lineHeight.displayLarge,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.bold,
  },
  headline: {
    fontSize: typography.fontSize.headline,
    lineHeight: typography.lineHeight.headline,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.bold,
  },
  title: {
    fontSize: typography.fontSize.title,
    lineHeight: typography.lineHeight.title,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.semibold,
  },
  subtitle: {
    fontSize: typography.fontSize.subtitle,
    lineHeight: typography.lineHeight.subtitle,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.medium,
  },
  body: {
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    fontWeight: typography.fontWeight.regular,
    fontFamily: typography.fontFamily.regular,
  },
  bodySmall: {
    fontSize: typography.fontSize.bodySmall,
    lineHeight: typography.lineHeight.bodySmall,
    fontWeight: typography.fontWeight.regular,
    fontFamily: typography.fontFamily.regular,
  },
  caption: {
    fontSize: typography.fontSize.caption,
    lineHeight: typography.lineHeight.caption,
    fontWeight: typography.fontWeight.regular,
    fontFamily: typography.fontFamily.regular,
  },
  button: {
    fontSize: typography.fontSize.button,
    lineHeight: typography.lineHeight.button,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.semibold,
  },
} as const;

export type TextStyleName = keyof typeof textStyles;
