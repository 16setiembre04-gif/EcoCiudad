export const AUTH_CONSTANTS = {
  REDIRECT_URL: 'ecociudad://reset-password',
  VERIFICATION_RESEND_COOLDOWN: 60,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_MIN_LENGTH: 9,
  PHONE_MAX_LENGTH: 15,
  BIOMETRIC_PLACEHOLDER: false,
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
  INVALID_CREDENTIALS: 'Correo o contraseña inválidos',
  EMAIL_NOT_CONFIRMED: 'Por favor verifica tu correo antes de iniciar sesión',
  WEAK_PASSWORD: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORDS_NO_MATCH: 'Las contraseñas no coinciden',
  INVALID_EMAIL: 'Correo electrónico inválido',
  TERMS_REQUIRED: 'Debes aceptar los términos y condiciones',
  NAME_TOO_SHORT: 'El nombre debe tener al menos 2 caracteres',
  PHONE_INVALID: 'Número de teléfono inválido',
  ACCOUNT_EXISTS: 'Ya existe una cuenta con este correo',
  NETWORK_ERROR: 'Ocurrió un error de red. Por favor intenta de nuevo.',
} as const;

export const PASSWORD_STRENGTH = {
  WEAK: 'weak',
  FAIR: 'fair',
  GOOD: 'good',
  STRONG: 'strong',
} as const;

export type PasswordStrengthLevel = (typeof PASSWORD_STRENGTH)[keyof typeof PASSWORD_STRENGTH];
