// Copyright (C) LoginID

import { StorageErrorCode } from "./types";

/**
 * Error class for storage related errors.
 */
export class StorageError extends Error {
  /**
   * The error code.
   *
   * @type {string}
   * @memberof StorageError
   */
  public code?: StorageErrorCode;

  /**
   * Initializes a new instance of StorageError with the provided message.
   *
   * @type {Error}
   * @memberof StorageError
   */
  constructor(message: string, code?: StorageErrorCode) {
    super(message);
    this.name = "StorageError";
    this.code = code;
  }
}
