// Copyright (C) LoginID

import { LoginIDError, PasskeyError } from "../errors";

/**
 * Identifies the error that occurred during passkey creation.
 *
 * @param {Error} error The error that occurred during passkey creation.
 * @param {CredentialCreationOptions} options The options used to create the passkey.
 * @returns {PasskeyError | Error} The identified error.
 */
export const identifyCreateError = (
  error: Error,
  options: CredentialCreationOptions,
): PasskeyError | Error => {
  const name = error.name;
  const { publicKey } = options;

  if (name === "ConstraintError") {
    if (publicKey?.authenticatorSelection?.requireResidentKey === true) {
      return new PasskeyError(
        "Your device does not support discoverable credentials",
        "ERROR_DISCOVERABLE_CREDENTIALS_UNSUPPORTED",
        error,
      );
    }

    if (publicKey?.authenticatorSelection?.userVerification === "required") {
      return new PasskeyError(
        "Your device does not support user verification",
        "ERROR_USER_VERIFICATION_UNSUPPORTED",
        error,
      );
    }
  }

  // This is the most import error to catch. It means that a passkey already exists
  // within the authenticator for this current user.
  if (name === "InvalidStateError") {
    return new PasskeyError(
      "A passkey already exists on your device",
      "ERROR_PASSKEY_EXISTS",
      error,
    );
  }

  // Platforms overload this error and it's not always clear what the actual error is.
  // Best to generalize it.
  if (name === "NotAllowedError") {
    return new PasskeyError(
      "Passkey creation has failed",
      "ERROR_GENERAL_ERROR",
      error,
    );
  }

  if (name === "NotSupportedError") {
    return new PasskeyError(
      "Your device does not support the algorithms required for passkey creation",
      "ERROR_ALGORITHMS_UNSUPPORTED",
      error,
    );
  }

  if (name === "SecurityError") {
    const rpId = publicKey?.rp?.id;
    if (rpId !== window.location.hostname) {
      return new PasskeyError(
        `The domain of the relying party (${rpId}) is invalid for this domain`,
        "ERROR_DOMAIN_MISMATCH",
        error,
      );
    }
  }

  if (name === "UnknownError") {
    return new PasskeyError(
      "Your device could not process the requested options or could not create a new passkey",
      "ERROR_AUTHENTICATOR_UNKNOWN_ERROR",
      error,
    );
  }

  return error;
};

/**
 * Identifies the error that occurred during passkey authentication.
 *
 * @param {Error} error The error that occurred during passkey authentication.
 * @param {CredentialRequestOptions} options The options used to authenticate with the passkey.
 * @returns {PasskeyError | Error} The identified error.
 */
export const identifyGetError = (
  error: Error,
  options: CredentialRequestOptions,
): PasskeyError | Error => {
  const name = error.name;
  const { publicKey } = options;

  if (name === "AbortError") {
    if (options.signal instanceof AbortSignal) {
      return new PasskeyError(
        "Passkey authentication has been aborted",
        "ERROR_PASSKEY_ABORTED",
        error,
      );
    }
  }

  // Platforms overload this error and it's not always clear what the actual error is.
  // Best to generalize it.
  if (name === "NotAllowedError") {
    return new PasskeyError(
      "Passkey authentication has failed",
      "ERROR_GENERAL_ERROR",
      error,
    );
  }

  if (name === "SecurityError") {
    const rpId = publicKey?.rpId;
    if (rpId !== window.location.hostname) {
      return new PasskeyError(
        `The domain of the relying party (${rpId}) is invalid for this domain`,
        "ERROR_DOMAIN_MISMATCH",
        error,
      );
    }
  }

  if (name === "UnknownError") {
    return new PasskeyError(
      "Your device could not process the requested options or could not authenticate with a passkey",
      "ERROR_AUTHENTICATOR_UNKNOWN_ERROR",
      error,
    );
  }

  return error;
};

export const USER_NO_OP_ERROR = new LoginIDError(
  "User needs to be logged in to perform this operation.",
);
export const NO_LOGIN_OPTIONS_ERROR = new LoginIDError(
  "No login options available.",
);
