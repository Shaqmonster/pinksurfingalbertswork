// Copyright (C) LoginID

/**
 * Error class for LoginID SDK related errors.
 */
export class LoginIDError extends Error {
    /**
     * Initializes a new instance of LoginIDError with the provided message.
     *
     * @type {Error}
     * @memberof AbortError
     */
    constructor(message: string) {
      super(message);
      this.name = "LoginIDError";
    }
  }
  