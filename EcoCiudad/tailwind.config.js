/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          light: '#A5D6A7',
          'on-primary': '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#66BB6A',
          'on-secondary': '#FFFFFF',
        },
        'operator-primary': {
          DEFAULT: '#1565C0',
          light: '#90CAF9',
        },
        'operator-secondary': {
          DEFAULT: '#42A5F5',
        },
        background: {
          DEFAULT: '#F8FAFC',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          variant: '#F1F5F9',
        },
        border: {
          DEFAULT: '#E2E8F0',
        },
        divider: {
          DEFAULT: '#CBD5E1',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          disabled: '#94A3B8',
        },
        success: {
          DEFAULT: '#22C55E',
        },
        warning: {
          DEFAULT: '#FACC15',
        },
        error: {
          DEFAULT: '#EF4444',
        },
        info: {
          DEFAULT: '#3B82F6',
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
