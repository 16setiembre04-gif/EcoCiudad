export const colors = {
  citizen: {
    primary: '#2E7D32',
    secondary: '#66BB6A',
    lightGreen: '#A5D6A7',
  },
  operator: {
    primary: '#1565C0',
    secondary: '#42A5F5',
  },
  neutral: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    border: '#E2E8F0',
    divider: '#CBD5E1',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    disabled: '#94A3B8',
  },
  semantic: {
    success: '#22C55E',
    warning: '#FACC15',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export type ColorToken = typeof colors;
