import { type DomainError } from '../domain/errors';

export const handleDomainError = (error: DomainError): string => {
  switch (error.type) {
    case 'AuthenticationError':
      return 'Invalid credentials. Please try again.';
    case 'NetworkError':
      return 'Network error. Please check your connection.';
    case 'ValidationError':
      return error.message;
    case 'NotFoundError':
      return 'The requested resource was not found.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('Network') || error.message.includes('fetch');
  }
  return false;
};
