export const AUTH_CONSTANTS = {
  REDIRECT_URL: 'ecociudad://reset-password',
  VERIFICATION_RESEND_COOLDOWN: 60,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_MIN_LENGTH: 9,
  PHONE_MAX_LENGTH: 15,
  BIOMETRIC_PLACEHOLDER: true,
  GUEST_MODE_ENABLED: true,
} as const;

export const AUTH_ROUTES = {
  ROLE_SELECTION: '/(auth)/role-selection',
  CITIZEN_LOGIN: '/(auth)/citizen-login',
  CITIZEN_REGISTER: '/(auth)/citizen-register',
  OPERATOR_LOGIN: '/(auth)/operator-login',
  OPERATOR_REGISTER: '/(auth)/operator-register',
  FORGOT_PASSWORD: '/(auth)/forgot-password',
  RESET_PASSWORD: '/(auth)/reset-password',
  VERIFY_EMAIL: '/(auth)/verify-email',
  CITIZEN_DASHBOARD: '/(citizen)',
  OPERATOR_DASHBOARD: '/(operator)',
  ADMIN_DASHBOARD: '/(admin)',
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_NOT_CONFIRMED: 'Please verify your email before signing in',
  WEAK_PASSWORD: 'Password must be at least 8 characters',
  PASSWORDS_NO_MATCH: 'Passwords do not match',
  INVALID_EMAIL: 'Invalid email address',
  TERMS_REQUIRED: 'You must accept the terms and conditions',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  PHONE_INVALID: 'Invalid phone number',
  ACCOUNT_EXISTS: 'An account with this email already exists',
  NETWORK_ERROR: 'A network error occurred. Please try again.',
} as const;

export const PASSWORD_STRENGTH = {
  WEAK: 'weak',
  FAIR: 'fair',
  GOOD: 'good',
  STRONG: 'strong',
} as const;

export type PasswordStrengthLevel = (typeof PASSWORD_STRENGTH)[keyof typeof PASSWORD_STRENGTH];
