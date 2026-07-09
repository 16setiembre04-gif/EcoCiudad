/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22C55E',
          light: '#DCFCE7',
          container: '#DCFCE7',
          'on-primary': '#FFFFFF',
          'on-container': '#166534',
        },
        secondary: {
          DEFAULT: '#16A34A',
          light: '#BBF7D0',
          'on-secondary': '#FFFFFF',
        },
        'operator-primary': {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
        },
        'operator-secondary': {
          DEFAULT: '#2563EB',
        },
        background: {
          DEFAULT: '#FAFAFA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          variant: '#F1F5F9',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
        divider: {
          DEFAULT: '#E5E7EB',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          disabled: '#9CA3AF',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
        },
      },
      fontFamily: {
        sans: ['Inter-Regular', 'System'],
        medium: ['Inter-Medium', 'System'],
        semibold: ['Inter-SemiBold', 'System'],
        bold: ['Inter-Bold', 'System'],
      },
      fontSize: {
        caption: ['12px', { lineHeight: '16px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        body: ['16px', { lineHeight: '24px' }],
        button: ['16px', { lineHeight: '24px' }],
        subtitle: ['20px', { lineHeight: '28px' }],
        title: ['24px', { lineHeight: '32px' }],
        headline: ['28px', { lineHeight: '36px' }],
        'display-lg': ['32px', { lineHeight: '40px' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
      },
      borderRadius: {
        input: '12px',
        button: '14px',
        card: '20px',
        'bottom-sheet': '24px',
        fab: '28px',
        dialog: '20px',
      },
      minWidth: {
        'touch-target': '44px',
      },
      minHeight: {
        'touch-target': '44px',
      },
    },
  },
  plugins: [],
};
