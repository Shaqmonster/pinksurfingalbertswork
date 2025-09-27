// Copyright (C) LoginID

import { LoginIDBase, LoginIDConfig } from "../controllers";
import { PasskeyError, PasskeyErrorCode } from "../errors";
import { Session } from "../api";

/**
 * Set of passkey error codes that should be excluded from client-side error reporting.
 *
 * These error codes are considered non-critical or expected, and thus are not reported
 * to the backend analytics system.
 *
 * @constant
 */
const ERROR_CODE_BLACKLIST = new Set<PasskeyErrorCode>([
  "ERROR_PASSKEY_ABORTED",
]);

/**
 * Handles client-side events reporting for LoginID services.
 *
 * This class provides a mechanism for capturing and submitting client-side events,
 */
export class ClientEvents extends LoginIDBase {
  /**
   * Initializes a new ClientEvents instance with the provided configuration.
   *
   * @param {LoginIDMfaConfig} config Configuration object for LoginID services.
   */
  constructor(config: LoginIDConfig) {
    super(config);
  }

  /**
   * Reports a client-side error to the LoginID backend for tracking and diagnostics.
   *
   * This method handles errors that occur in any flow involving an encrypted session.
   * If the error is an instance of `PasskeyError`, it extracts the original error details,
   * formats them into a message, and submits the error to the backend using the provided session.
   *
   * @param {string} session - The encrypted session token used for authorization.
   * @param {Error} error - The error to report. Only `PasskeyError` instances are submitted.
   */
  public async reportError(session: string, error: Error) {
    const { disableAnalytics } = this.config.getConfig();
    if (disableAnalytics) {
      return { session: "" } as Session;
    }

    if (error instanceof PasskeyError) {
      if (ERROR_CODE_BLACKLIST.has(error.code)) {
        return { session: "" } as Session;
      }

      const originalError = error.cause as Error;
      const message = `${error.code} - ${error.message} - ${originalError.name} - ${originalError.message}`;
      return await this.service.clientEvents.clientEventsSubmit({
        authorization: session,
        requestBody: { isError: true, event: message },
      });
    }
  }
}
