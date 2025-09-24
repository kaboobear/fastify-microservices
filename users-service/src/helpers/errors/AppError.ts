export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;
  readonly isOperational = true;

  constructor(
    code: string,
    message: string,
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class UserNotFoundError extends AppError {
  constructor(id: number) {
    super("USER_NOT_FOUND", `User with id ${id} not found`, 404);
  }
}
export class EmailTakenError extends AppError {
  constructor(email: string) {
    super("EMAIL_TAKEN", "Email already registered", 409, { email });
  }
}
export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super("INVALID_REFRESH", "Invalid refresh token", 403);
  }
}
