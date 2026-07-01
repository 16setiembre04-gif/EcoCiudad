export abstract class DomainError {
  abstract readonly type: string;
  abstract readonly message: string;

  constructor(public readonly context?: Record<string, unknown>) {}
}

export class UnexpectedError extends DomainError {
  readonly type = 'UnexpectedError';
  readonly message = 'An unexpected error occurred';
}

export class NetworkError extends DomainError {
  readonly type = 'NetworkError';
  readonly message = 'A network error occurred';
}

export class ValidationError extends DomainError {
  readonly type = 'ValidationError';
  constructor(
    readonly message: string,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super();
  }
}

export class AuthenticationError extends DomainError {
  readonly type = 'AuthenticationError';
  readonly message = 'Authentication failed';
}

export class NotFoundError extends DomainError {
  readonly type = 'NotFoundError';
  constructor(readonly message: string = 'Resource not found') {
    super();
  }
}
