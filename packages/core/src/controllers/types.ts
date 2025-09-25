// Copyright (C) LoginID

import { User, Mfa, MfaAction } from "../api";

export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type UsernameType = User["usernameType"];

export type MfaFactorName = MfaAction["action"]["name"];
export type MfaFactor = MfaAction;
export type MfaFlow = Mfa["flow"];

export interface MfaInfo {
  username?: string;
  flow?: MfaFlow;
  next?: MfaAction[];
  session?: string;
}

/**
 * Configuration for LoginID FIDO service.
 *
 * @expand
 */
export interface LoginIDConfig {
  /**
   * The base URL for LoginID FIDO service which can be obtained on the [dashboard](https://dashboard.loginid.io).
   */
  baseUrl: string;

  /**
   * The optional app ID for specific application.
   */
  appId?: string;

  /**
   * If true, disables sending analytics/events to LoginID. Defaults to false.
   */
  disableAnalytics?: boolean;
}

/**
 * Configuration for LoginID FIDO service.
 */
export interface LoginIDMfaConfig {
  /**
   * The base URL for LoginID FIDO service which can be obtained on the [dashboard](https://dashboard.loginid.io).
   */
  baseUrl: string;

  /**
   * The optional app ID for specific application.
   */
  appId?: string;
}

/**
 * Options for beginning Multi-Factor Authentication (MFA).
 */
export interface MfaBeginOptions {
  /**
   * A human-palatable name for the user account, intended only for display on your passkeys and modals.
   */
  displayName?: string;

  /**
   * The type of username validation to be used. Defaults to **`other`**.
   */
  usernameType?: UsernameType;

  /**
   * A string representing transaction details for confirmation during MFA.
   * This can be any descriptive text, but using a JSON-formatted string is recommended
   * for structured transaction details.
   *
   * Example (plain text):
   * ```
   * Payment of $100 to John Doe
   * ```
   *
   * Example (JSON):
   * ```json
   * {
   *   "transactionId": "12345",
   *   "amount": "100.00",
   *   "currency": "USD",
   *   "recipient": "john.doe@example.com"
   * }
   * ```
   */
  txPayload?: string;

  /**
   * An identifier generated on the merchant side to identify the current checkout session.
   * This identifier is used as a key to retrieve associated trust information.
   *
   * It is passed to the wallet to link the session with wallet-issued identity data,
   * enabling secure transaction confirmation without revealing end-user identity to the merchant.
   */
  checkoutId?: string;
}

/**
 * Options for performing an MFA authentication factor.
 */
export interface MfaPerformActionOptions {
  /**
   * The MFA state session.
   * This should be obtained from a previous MFA request or initiation step.
   */
  session?: string;

  /**
   * The payload required for completing the authentication factor.
   * This typically contains user input or challenge-response data.
   */
  payload?: string;

  /**
   * Enables passkey support in browser autofill suggestions (conditional UI), if supported.
   */
  autoFill?: boolean;

  /**
   * A human-palatable name for the user account, intended only for display on your passkeys..
   */
  displayName?: string;
}

/**
 * Represents an individual MFA factor that the user must complete.
 */
export interface RemainingFactor {
  /**
   * The type of the MFA factor, such as passkey or OTP via email or SMS.
   * Use this value in performAction to initiate the factor.
   */
  type: MfaFactorName;

  /**
   * A user-friendly label for the factor, providing context on how it should be used.
   */
  label: string;

  /**
   * A description of the MFA factor, explaining its purpose or instructions for completion.
   */
  description?: string;

  /**
   * A unique token for authentication, useful for advanced MFA flows across multiple devices.
   *
   * This is available for the following MFA factor:
   * - passkey
   *
   * Example: To authenticate or add a passkey on another device, pass this value
   * along with the session token to continue the MFA process.
   */
  value?: string;

  /**
   * A list of available options for the MFA factor, if applicable.
   *
   * Supported for the following MFA factors:
   * - otp:email
   * - otp:sms
   *
   * Typically includes valid email addresses or phone numbers for OTP delivery.
   */
  options?: string[];
}

/**
 * Represents the result of a Multi-Factor Authentication (MFA) session.
 * This interface is used to track the status of an ongoing MFA process, including
 * remaining factors, user details, and issued authentication tokens.
 *
 * @expand
 */
export interface MfaSessionResult {
  /**
   * The MFA flow type indicating whether the session is part of sign-in or sign-up.
   * This helps differentiate between authentication scenarios.
   */
  flow?: MfaFlow;

  /**
   * List of MFA factors that still need to be completed for authentication.
   * If this list is empty, the authentication process is complete.
   */
  remainingFactors: RemainingFactor[];

  /**
   * The username associated with the authentication session.
   * This may be undefined if not provided or applicable.
   */
  username?: string;

  /**
   * Indicates whether the MFA session is complete.
   * If `true`, all required factors have been successfully validated.
   */
  isComplete: boolean;

  /**
   * The MFA state session.
   * This should be obtained from a previous MFA request or initiation step.
   */
  session?: string;

  /**
   * A JSON Web Token (JWT) issued upon successful authentication.
   * Used to verify user identity and grant access to protected resources.
   */
  idToken?: string;

  /**
   * A JSON Web Token (JWT) used for authorizing API requests.
   * This token grants access to user-specific resources and actions.
   */
  accessToken?: string;

  /**
   * A token used to obtain new access and ID tokens after expiration.
   * This helps maintain user sessions without requiring re-authentication.
   */
  refreshToken?: string;

  /**
   * A JSON Web Signature (JWS) that provides cryptographic proof of the payload's integrity.
   * Ensures that the authentication data has not been tampered with.
   */
  payloadSignature?: string;

  /**
   * The next recommended MFA factor action to take.
   * Indicates which MFA factor the user should complete next in order to proceed.
   */
  nextAction?: MfaFactorName;
}

/**
 * The result of verifying the application's configuration settings.
 */
export interface VerifyConfigResult {
  /**
   * Indicates whether the configuration is valid.
   */
  isValid: boolean;

  /**
   * Suggested solution to fix any configuration issues.
   */
  solution?: string;

  /**
   * A message describing the issue with the configuration, if any.
   */
  message?: string;

  /**
   * A code representing the error type.
   */
  code?: string;
}
