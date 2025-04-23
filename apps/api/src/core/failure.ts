/**
 * Represents a failure or error case in the application logic.
 * Can be extended for specific failure types.
 */
export abstract class Failure {
  readonly message: string;
  readonly code?: string | number; // Optional error code or identifier

  constructor(message: string, code?: string | number) {
    this.message = message;
    this.code = code;
  }
}

// Example of a specific failure type
export class DatabaseFailure extends Failure {
  constructor(
    message: string = 'Database operation failed.',
    code: string = 'DB_ERROR',
  ) {
    super(message, code);
  }
}

export class NotFoundFailure extends Failure {
  constructor(resource: string = 'Resource', identifier?: string) {
    const msg = identifier
      ? `${resource} with identifier "${identifier}" not found.`
      : `${resource} not found.`;
    super(msg, 'NOT_FOUND');
  }
}

export class ValidationFailure extends Failure {
  constructor(
    message: string = 'Input validation failed.',
    code: string = 'VALIDATION_ERROR',
  ) {
    super(message, code);
  }
}

// Add other specific failure types as needed (e.g., NetworkFailure, AuthenticationFailure)
