// Copyright (C) LoginID

import {
    ApiError,
    AuthCode,
    CreationResult,
    DeviceInfo,
  } from "@loginid/core/api";
  import { UsernameType } from "@loginid/core/controllers";
  
  export type Complete<T> = {
    [P in keyof T]-?: T[P];
  };
  
  export type DeviceInfoRequestBody = DeviceInfo;
  export type Transports = CreationResult["transports"];
  
  export type Message = "email" | "sms";
  
  export type FallbackOptions = string[];
  export type FallbackCallback = (
    username: string,
    options: FallbackOptions,
  ) => Promise<void>;
  export type SuccessCallback = (result: AuthResult) => Promise<void>;
  
  export interface Callbacks {
    onFallback?: FallbackCallback;
    onSuccess?: SuccessCallback;
  }
  
  export interface AllOptions {
    authzToken?: string;
    usernameType?: UsernameType;
    displayName?: string;
    callbacks?: Callbacks;
  }
  
  /**
   * The base interface for passkey options.
   */
  export interface MainPasskeyOptions {
    /**
     * Authorization token used for accessing protected resources typically used for adding multiple passkeys to a user.
     */
    authzToken?: string;
  
    /**
     * Callback functions that can be triggered on various events during the authentication process.
     */
    callbacks?: Callbacks;
  
    /**
     * The type of username validation to be used. Defaults to **`other`**.
     */
    usernameType?: UsernameType;
    // disable hints for now
    //hints?: string[]
  }
  
  /**
   * The base interface for passkey management options.
   */
  export interface PasskeyManagementOptions {
    /**
     * Authorization token used for authorizing passkey management actions.
     */
    authzToken?: string;
  }
  
  /**
   * List passkeys options.
   *
   * @expand
   */
  export interface ListPasskeysOptions extends PasskeyManagementOptions {}
  
  /**
   * Rename passkeys options.
   *
   * @expand
   */
  export interface RenamePasskeyOptions extends PasskeyManagementOptions {}
  
  /**
   * Delete passkeys options.
   *
   * @expand
   */
  export interface DeletePasskeyOptions extends PasskeyManagementOptions {}
  
  /**
   * Authenticate with passkeys options.
   *
   * @expand
   */
  export interface AuthenticateWithPasskeysOptions extends MainPasskeyOptions {
    /**
     * When true it will enable passkeys on the browser autofill suggestions if supported (conditional UI). Username does not need to be set.
     */
    autoFill?: boolean;
  
    /**
     * This should be used with the **`options.autoFill`** option to trigger the cancellation of the passkey conditional UI.
     * Pass this if additional passkeys API calls may be anticipated on the current context page.
     */
    abortController?: AbortController;
  }
  
  /**
   * Authenticate with passkey autofill options.
   *
   * @expand
   */
  export interface AuthenticateWithPasskeyAutofillOptions
    extends AuthenticateWithPasskeysOptions {}
  
  /**
   * Create passkeys options interface.
   *
   * @expand
   */
  export interface CreatePasskeyOptions extends MainPasskeyOptions {
    /**
     * A human-palatable name for the user account, intended only for display on your passkeys and modals.
     */
    displayName?: string;
  
    /**
     * A custom label or nickname for the passkey itself, used to help users distinguish between multiple passkeys.
     * If not provided, a default name may be auto-generated based on the device and/or user-agent.
     */
    passkeyName?: string;
  
    /**
     * Indicates that the credential should be a cross-platform FIDO credential (e.g., a hardware security key or a hybrid passkey).
     */
    crossPlatform?: boolean;
  }
  
  /**
   * Confirm transaction options.
   *
   * @expand
   */
  export interface ConfirmTransactionOptions extends MainPasskeyOptions {
    /**
     * Specify the type of transaction being confirmed for additional validation.
     */
    txType?: string;
  
    /**
     * A unique nonce to ensure the transaction's integrity and prevent replay attacks
     */
    nonce?: string;
  }
  
  /**
   * Request and send OTP options.
   *
   * @expand
   */
  export interface RequestAndSendOtpOptions {
    /**
     * The type of username validation to be used. Defaults to **`other`**.
     */
    usernameType?: UsernameType;
  }
  
  /**
   * Request OTP options.
   *
   * @expand
   */
  export interface RequestOtpOptions
    extends AuthenticateWithPasskeyAutofillOptions {}
  
  /**
   * Validate OTP options.
   *
   * @expand
   */
  export interface ValidateOtpOptions extends RequestAndSendOtpOptions {}
  
  /**
   * The result after requesting an OTP with **`requestOtp`**.
   */
  export interface Otp extends AuthCode {}
  
  /**
   * The result after a successful authentication process either with passkeys or OTP.
   */
  export interface AuthResult {
    /**
     * Indicates whether the user is authenticated. If **`false`**, a fallback options can be taken place if available on **`fallbackOptions`**.
     */
    isAuthenticated: boolean;
  
    /**
     * A short-lived authorization token is returned, allowing access to protected resources for the given user such as listing, renaming or deleting passkeys.
     */
    token: string;
  
    /**
     * The unique identifier of the authenticated user.
     */
    userId: string;
  
    /**
     * The identifier for the passkey used in authentication, if applicable.
     */
    passkeyId?: string;
  
    /**
     * An identifier for the device used in the authentication process. This property helps determine if supported authentications can be proceeded,
     * allowing future authentications to identify the device correctly.
     */
    deviceID?: string;
  
    /**
     * If **`true`**, the authentication process should resort to a fallback method as specified in **`fallbackOptions`**.
     */
    isFallback: boolean;
  
    /**
     * This property will be returned if the LoginID indicates that the user is unlikely to proceed with passkey authentication.
     * In this case, instead of prompting for passkey authentication, available cross-authentication options are listed as an alternative,
     * providing suggested authentications to use instead.
     */
    fallbackOptions?: FallbackOptions;
  }
  
  export { ApiError };
  