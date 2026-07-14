export abstract class DomainError {
  abstract readonly type: string;
  abstract readonly message: string;

  constructor(public readonly context?: Record<string, unknown>) {}
}

export class UnexpectedError extends DomainError {
  readonly type = 'UnexpectedError';
  readonly message: string;
  constructor(message: string = 'An unexpected error occurred', context?: Record<string, unknown>) {
    super(context);
    this.message = message;
  }
}

export class NetworkError extends DomainError {
  readonly type = 'NetworkError';
  readonly message: string;
  constructor(message: string = 'A network error occurred') {
    super();
    this.message = message;
  }
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
  readonly message: string;
  constructor(message: string = 'Authentication failed') {
    super();
    this.message = message;
  }
}

export class NotFoundError extends DomainError {
  readonly type = 'NotFoundError';
  constructor(readonly message: string = 'Resource not found') {
    super();
  }
}
