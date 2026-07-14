export const sizes = {
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  },
  touchTarget: {
    min: 48,
    sm: 44,
  },
} as const;

export type SizeToken = typeof sizes;
