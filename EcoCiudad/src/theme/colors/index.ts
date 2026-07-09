export const colors = {
  citizen: {
    primary: '#22C55E',
    secondary: '#16A34A',
    lightGreen: '#DCFCE7',
  },
  operator: {
    primary: '#3B82F6',
    secondary: '#2563EB',
  },
  neutral: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    border: '#E5E7EB',
    divider: '#E5E7EB',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textDisabled: '#9CA3AF',
  },
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export type ColorToken = typeof colors;
