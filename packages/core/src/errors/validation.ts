// Copyright (C) LoginID

import { ValidationErrorCode } from "./types";

/**
 * Error class for input validation errors.
 */
export class ValidationError extends Error {
  /**
   * A machine-readable code that identifies the type of validation error.
   *
   * @type {ValidationErrorCode}
   * @memberof ValidationError
   */
  public readonly code: ValidationErrorCode;

  /**
   * (Optional) The name of the input field that caused the error.
   *
   * @type {string | undefined}
   * @memberof ValidationError
   */
  public readonly field?: string;

  /**
   * Initializes a new instance of ValidationError.
   *
   * @param message - Human-readable error message.
   * @param code - Specific validation error code.
   * @param field - Optional field name that caused the error.
   */
  constructor(message: string, code: ValidationErrorCode, field?: string) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
    this.field = field;
  }
}
