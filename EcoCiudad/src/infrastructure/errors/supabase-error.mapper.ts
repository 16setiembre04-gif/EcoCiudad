import { DomainError, UnexpectedError, NetworkError, ValidationError, AuthenticationError, NotFoundError } from '@/domain/errors';

interface SupabaseError {
  code?: string;
  message?: string;
  statusCode?: number;
}

function isSupabaseError(error: unknown): error is SupabaseError {
  return typeof error === 'object' && error !== null && ('code' in error || 'message' in error);
}

function isNetworkError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const message = String((error as { message?: string }).message).toLowerCase();
  return (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('abort') ||
    (error as { name?: string }).name === 'AbortError' ||
    (error as { name?: string }).name === 'TypeError'
  );
}

const SPANISH_MESSAGES: Record<string, string> = {
  '23505': 'Ya existe un registro con esos datos.',
  '23502': 'Faltan datos obligatorios.',
  '23503': 'El registro relacionado no existe.',
  '23514': 'Los datos no cumplen una restricción.',
  'PGRST116': 'No se encontró el recurso solicitado.',
  '42501': 'No tienes permiso para realizar esta acción.',
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/weak-password': 'La contraseña es demasiado débil.',
  'auth/user-not-found': 'No existe una cuenta con esos datos.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/email-already-in-use': 'El correo ya está registrado.',
};

export function mapSupabaseErrorToDomainError(error: unknown): DomainError {
  if (isNetworkError(error)) {
    return new NetworkError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
  }

  if (!isSupabaseError(error)) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
    return new UnexpectedError(message);
  }

  const code = error.code ?? '';
  const spanishMessage = SPANISH_MESSAGES[code];

  if (code === 'PGRST116') {
    return new NotFoundError(spanishMessage ?? 'No se encontró el recurso solicitado.');
  }

  if (code === '42501' || (error.message && error.message.toLowerCase().includes('permission denied'))) {
    return new AuthenticationError(spanishMessage ?? 'No tienes permiso para realizar esta acción.');
  }

  if (['23505', '23502', '23503', '23514'].includes(code)) {
    return new ValidationError(spanishMessage ?? 'Los datos enviados no son válidos.');
  }

  if (spanishMessage) {
    return new UnexpectedError(spanishMessage);
  }

  const fallbackMessage = error.message && error.message.trim().length > 0
    ? error.message
    : 'Ocurrió un error inesperado.';

  return new UnexpectedError(fallbackMessage);
}
