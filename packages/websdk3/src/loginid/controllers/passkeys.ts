// Copyright (C) LoginID

import type {
    AuthenticateWithPasskeyAutofillOptions,
    AuthenticateWithPasskeysOptions,
    AuthResult,
    ConfirmTransactionOptions,
    CreatePasskeyOptions,
    Otp,
    RequestOtpOptions,
  } from "../types";
  import {
    AuthInit,
    AuthInitRequestBody,
    JWT,
    RegInitRequestBody,
    TxComplete,
    TxCompleteRequestBody,
    TxInitRequestBody,
  } from "@loginid/core/api";
  import {
    confirmTransactionOptions,
    passkeyOptions,
    toAuthResult,
  } from "../lib/defaults";
  import { NO_LOGIN_OPTIONS_ERROR, WebAuthnHelper } from "@loginid/core/webauthn";
  import { defaultDeviceInfo } from "@loginid/core/utils/browser";
  import { DeviceStore, TrustStore } from "@loginid/core/store";
  import { ClientEvents } from "@loginid/core/client-events";
  import { LoginIDConfig } from "@loginid/core/controllers";
  import { parseJwt } from "@loginid/core/utils/crypto";
  import { mergeFallbackOptions } from "../lib/utils";
  import OTP from "./otp";
  
  /**
   * Extends LoginIDBase to support creation and authentication of passkeys.
   */
  class Passkeys extends OTP {
    /**
     * Initializes a new Passkeys instance with the provided configuration.
     *
     * @param {LoginIDConfig} config Configuration object for LoginID.
     *
     */
    constructor(config: LoginIDConfig) {
      super(config);
    }
  
    /**
     * This method helps to create a passkey. The only required parameter is the username, but additional attributes can be provided in the options parameter.
     * Note: While the authorization token is optional, it must always be used in a production environment. You can skip it during development by adjusting
     * the app configuration in the LoginID dashboard.
     *
     * A short-lived authorization token is returned, allowing access to protected resources for the given user such as listing, renaming or deleting passkeys.
     *
     * @param {string} username Username to register.
     * @param {string} authzToken Authorization token for passkey creation.
     * @param {CreatePasskeyOptions} options Additional passkey creation options.
     * @returns {Promise<AuthResult>} Result of the passkey creation operation.
     * @example
     * ```javascript
     * import { LoginIDWebSDK } from "@loginid/websdk3";
     *
     * // Obtain credentials from LoginID
     * const BASE_URL = process.env.BASE_URL;
     *
     * // Initialize the SDK with your configuration
     * const config = {
     *   baseUrl: BASE_URL,
     * };
     *
     * // Use the SDK components for signup and signin
     * const lid = new LoginIDWebSDK(config);
     *
     * // Button click handler
     * async function handleSignupButtonClick() {
     *   const username = "billy@loginid.io";
     *
     *   try {
     *     // Sign up with a passkey
     *     const signupResult = await lid.createPasskey(username);
     *     // Handle the signup result
     *     console.log("Signup Result:", signupResult);
     *   } catch (error) {
     *     // Handle errors
     *     console.error("Error during signup:", error);
     *   }
     * }
     *
     * // Attach the click handler to a button
     * const signinButton = document.getElementById("signinButton");
     * signinButton.addEventListener("click", handleSigninButtonClick);
     * ```
     */
    async createPasskey(
      username: string,
      authzToken: string = "",
      options: CreatePasskeyOptions = {},
    ): Promise<AuthResult> {
      const appId = this.config.getAppId();
      const deviceId = DeviceStore.getDeviceId(appId);
      const deviceInfo = await defaultDeviceInfo(deviceId);
      const trustStore = new TrustStore(appId);
      const opts = passkeyOptions(username, authzToken, options);
  
      opts.authzToken = this.session.getToken(opts);
      if (opts.authzToken) {
        // guard against username mismatch
        const parsedToken = parseJwt(opts.authzToken);
        if (parsedToken.username !== username) {
          opts.authzToken = "";
        }
      }
  
      const trustInfo = await trustStore.setOrSignWithTrustId(username);
  
      const regInitRequestBody: RegInitRequestBody = {
        app: {
          id: appId,
        },
        deviceInfo: deviceInfo,
        user: {
          username: username,
          usernameType: opts.usernameType,
          displayName: opts.displayName,
        },
        passkeyOptions: { ...(options.crossPlatform && { securityKey: true }) },
        ...(trustInfo && { trustItems: { auth: trustInfo } }),
      };
  
      const regInitResponseBody = await this.service.reg.regRegInit({
        requestBody: regInitRequestBody,
        ...(opts.authzToken && { authorization: opts.authzToken }),
      });
  
      return await this.invokePasskeyApi(
        regInitResponseBody.session,
        async () => {
          const regCompleteRequestBody =
            await WebAuthnHelper.createNavigatorCredential(regInitResponseBody);
  
          if (options.passkeyName) {
            regCompleteRequestBody.passkeyName = options.passkeyName;
          }
  
          const regCompleteResponse = await this.service.reg.regRegComplete({
            requestBody: regCompleteRequestBody,
          });
  
          const result: AuthResult = toAuthResult(regCompleteResponse);
  
          this.session.setJwtCookie(regCompleteResponse.jwtAccess);
          DeviceStore.persistDeviceId(
            appId,
            deviceId || regCompleteResponse.deviceId,
          );
  
          return result;
        },
      );
    }
  
    /**
     * This method authenticates a user with a passkey and may trigger additional browser dialogs to guide the user through the process.
     *
     * A short-lived authorization token is returned, allowing access to protected resources for the given user such as listing, renaming or deleting passkeys.
     *
     * @param {string} username Username to authenticate. When empty, usernameless passkey authentication is performed.
     * @param {AuthenticateWithPasskeysOptions} options Additional authentication options.
     * @returns {Promise<AuthResult>} Result of the passkey authentication operation.
     * @example
     * ```javascript
     * import { LoginIDWebSDK } from "@loginid/websdk3";
     *
     * // Obtain credentials from LoginID
     * const BASE_URL = process.env.BASE_URL;
     *
     * // Initialize the SDK with your configuration
     * const config = {
     *   baseUrl: BASE_URL,
     * };
     *
     * // Use the SDK components for signup and signin
     * const lid = new LoginIDWebSDK(config);
     *
     * // Button click handler
     * async function handleSignupButtonClick() {
     *   const username = "billy@loginid.io";
     *
     *   try {
     *     // Sign in with a passkey
     *     const signinResult = await lid.authenticateWithPasskey(username);
     *     // Handle the signin result
     *     console.log("Signin Result:", signinResult);
     *   } catch (error) {
     *     // Handle errors
     *     console.error("Error during signin:", error);
     *   }
     * }
     *
     * // Attach the click handler to a button
     * const signinButton = document.getElementById("signinButton");
     * signinButton.addEventListener("click", handleSigninButtonClick);
     * ```
     */
    async authenticateWithPasskey(
      username = "",
      options: AuthenticateWithPasskeysOptions = {},
    ): Promise<AuthResult> {
      const appId = this.config.getAppId();
      const deviceInfo = await defaultDeviceInfo(DeviceStore.getDeviceId(appId));
      const trustStore = new TrustStore(appId);
      const opts = passkeyOptions(username, "", options);
  
      const trustInfo = await trustStore.setOrSignWithTrustId(
        options.autoFill ? "" : username,
      );
  
      const authInitRequestBody: AuthInitRequestBody = {
        app: {
          id: appId,
        },
        deviceInfo: deviceInfo,
        user: {
          username: username,
          usernameType: opts.usernameType,
        },
        ...(trustInfo && { trustItems: { auth: trustInfo } }),
      };
  
      const authInitResponseBody = await this.service.auth.authAuthInit({
        requestBody: authInitRequestBody,
      });
  
      switch (authInitResponseBody.action) {
        case "proceed": {
          // We can send original options here because WebAuthn options currently don't need to be defaulted
          return await this.invokePasskeyApi(
            authInitResponseBody.session,
            async () => {
              const authCompleteRequestBody =
                await WebAuthnHelper.getNavigatorCredential(
                  authInitResponseBody,
                  options,
                );
  
              const authCompleteResponse =
                await this.service.auth.authAuthComplete({
                  requestBody: authCompleteRequestBody,
                });
  
              const result = toAuthResult(authCompleteResponse);
  
              this.session.setJwtCookie(result.token);
  
              DeviceStore.persistDeviceId(appId, authCompleteResponse.deviceId);
  
              if (opts?.callbacks?.onSuccess) {
                await opts.callbacks.onSuccess(result);
              }
  
              return result;
            },
          );
        }
  
        case "crossAuth":
        case "fallback": {
          if (opts?.callbacks?.onFallback) {
            const fallbackOptions = mergeFallbackOptions(authInitResponseBody);
  
            await opts.callbacks.onFallback(username, fallbackOptions);
          }
  
          const emptyResponse: JWT = { userId: "", jwtAccess: "" };
          return toAuthResult(emptyResponse, false, true);
        }
  
        default:
          throw NO_LOGIN_OPTIONS_ERROR;
      }
    }
  
    /**
     * Authenticates a user by utilizing the browser's passkey autofill capabilities.
     *
     * A short-lived authorization token is returned, allowing access to protected resources for the given user such as listing, renaming or deleting passkeys.
     *
     * @param {AuthenticateWithPasskeyAutofillOptions} options Additional authentication options.
     * @returns {Promise<AuthResult>} Result of the passkey authentication operation.
     * @example
     * import { isConditionalUIAvailable, LoginIDWebSDK } from "@loginid/websdk3";
     *
     * // Obtain credentials from LoginID
     * const BASE_URL = process.env.BASE_URL;
     *
     * // Initialize the SDK with your configuration
     * const config = {
     *   baseUrl: BASE_URL,
     * };
     *
     * // Use the SDK components for signup and signin
     * const lid = new LoginIDWebSDK(config);
     *
     * window.addEventListener("load", async (event) => {
     *   try {
     *     const result = await isConditionalUIAvailable();
     *     if (!result) {
     *       // If conditional UI is not supported then continue without it or handle what to do
     *       // next here.
     *       return;
     *     }
     *
     *     const result = await lid.authenticateWithPasskeyAutofill();
     *     console.log("Authentication Result:", result);
     *   } catch (error) {
     *     // Handle errors
     *     console.error("Error during authentication:", error);
     *   }
     * });
     */
    async authenticateWithPasskeyAutofill(
      options: AuthenticateWithPasskeyAutofillOptions = {},
    ): Promise<AuthResult> {
      options.autoFill = true;
      return await this.authenticateWithPasskey("", options);
    }
  
    /**
     * This method returns a one-time OTP to be displayed on the current device. The user must be authenticated on this device.
     * The OTP is meant for cross-authentication, where the user reads the OTP from the screen and enters it on the target device.
     *
     * @param {string} username The username used for passkey authentication and OTP request.
     * @param {RequestOtpOptions} options Additional request OTP options.
     * @returns {Promise<Otp>} Result of the request OTP operation returning an OTP and expiry time.
     * @example
     * ```javascript
     * import { LoginIDWebSDK } from "@loginid/websdk3";
     *
     * // Obtain credentials from LoginID
     * const BASE_URL = process.env.BASE_URL;
     *
     * // Initialize the SDK with your configuration
     * const config = {
     *   baseUrl: BASE_URL,
     * };
     *
     * // Use the SDK components for signup and signin
     * const lid = new LoginIDWebSDK(config);
     *
     * // Button click handler
     * async function handleRequestOTPButtonClick() {
     *   const username = "billy@loginid.io";
     *
     *   try {
     *     // Request OTP with passkey
     *     const result = await lid.requestOtp(username);
     *     const otp = result.code;
     *     console.log("The OTP is: ", otp);
     *   } catch (error) {
     *     // Handle errors
     *     console.error("Error during authentication:", error);
     *   }
     * }
     *
     * // Attach the click handler to a button
     * const requestOTPButton = document.getElementById("requestOTPButton");
     * requestOTPButton.addEventListener("click", handleRequestOTPButtonClick);
     * ```
     */
    async requestOtp(
      username: string,
      options: RequestOtpOptions = {},
    ): Promise<Otp> {
      options.authzToken = this.session.getToken(options);
      // if no token is found, perform authentication
      if (!options.authzToken) {
        const result = await this.authenticateWithPasskey(username, options);
        // get token after authentication
        options.authzToken = result.token;
      }
  
      const result: Otp = await this.service.auth.authAuthCodeRequest({
        authorization: options.authzToken,
      });
  
      return result;
    }
  
    /**
     * This method initiates a non-repudiation signature process by generating a transaction-specific challenge
     * and then expects the client to provide an assertion response using a passkey.
     *
     * This method is useful for confirming actions such as payments
     * or changes to sensitive account information, ensuring that the transaction is being authorized
     * by the rightful owner of the passkey.
     *
     * For a more detailed guide click [here](https://docs.loginid.io/user-scenario/authentication/step-up/transaction-confirmation/).
     *
     * @param {string} username The username of the user confirming the transaction.
     * @param {string} txPayload The transaction-specific payload, which could include details
     * such as the transaction amount, recipient, and other metadata necessary for the transaction.
     * @param {ConfirmTransactionOptions} options Optional parameters for transaction confirmation.
     * @returns {Promise<TxComplete>} A promise that resolves with the result of the transaction confirmation operation.
     * The result includes details about the transaction's details and includes a new JWT access token.
     * @example
     * ```javascript
     * import { LoginIDWebSDK } from "@loginid/websdk3";
     *
     * const config = {
     *   baseUrl: BASE_URL,
     * };
     *
     * const lid = new LoginIDWebSDK(config);
     *
     * const username = "jane@securelogin.com";
     * const txPayload = JSON.stringify({
     *   amount: 100,
     *   recipient: "bob@securepay.com",
     * });
     * // Unique transaction nonce
     * const nonce = "f846bb01-492e-422b-944a-44b04adc441e";
     *
     * async function handleTransactionConfirmation() {
     *   try {
     *     // Confirm the transaction
     *     const confirmationResult = await lid.confirmTransaction(
     *       username,
     *       txPayload,
     *       nonce
     *     );
     *     // Handle the transaction confirmation result
     *     console.log("Transaction Confirmation Result:", confirmationResult);
     *
     *     // Check nonce
     *     const { nonce: resultNonce } = confirmationResult;
     *     if (nonce !== resultNonce) {
     *       throw new Error("Nonce mismatch");
     *     }
     *   } catch (error) {
     *     // Handle errors
     *     console.error("Error during transaction confirmation:", error);
     *   }
     * }
     *
     * // Attach the click handler to a button for transaction confirmation
     * const confirmTransactionButton = document.getElementById(
     *   "confirmTransactionButton"
     * );
     * confirmTransactionButton.addEventListener(
     *   "click",
     *   handleTransactionConfirmation
     * );
     * ```
     */
    async confirmTransaction(
      username: string,
      txPayload: string,
      options: ConfirmTransactionOptions = {},
    ): Promise<TxComplete> {
      const opts = confirmTransactionOptions(username, options);
      const txInitRequestBody: TxInitRequestBody = {
        username: username,
        txPayload: txPayload,
        nonce: opts.nonce,
        txType: opts.txType,
      };
  
      const { assertionOptions, session } = await this.service.tx.txTxInit({
        requestBody: txInitRequestBody,
      });
  
      const authInitResponseBody: AuthInit = {
        action: "proceed",
        crossAuthMethods: [],
        fallbackMethods: [],
        assertionOptions: assertionOptions,
        session: session,
      };
  
      return await this.invokePasskeyApi(
        authInitResponseBody.session,
        async () => {
          const { assertionResult } =
            await WebAuthnHelper.getNavigatorCredential(authInitResponseBody);
  
          const txCompleteRequestBody: TxCompleteRequestBody = {
            authenticatorData: assertionResult.authenticatorData,
            clientData: assertionResult.clientDataJSON,
            keyHandle: assertionResult.credentialId,
            session: session,
            signature: assertionResult.signature,
          };
  
          const result = await this.service.tx.txTxComplete({
            requestBody: txCompleteRequestBody,
          });
  
          return result;
        },
      );
    }
  
    /**
     * Internal helper method that executes a provided asynchronous function related to passkey flows
     * and reports any errors to the LoginID event tracking service if an exception occurs.
     *
     * @template T The return type of the asynchronous function passed in.
     * @param {string} session The current encrypted session associated with the operation being performed.
     * @param {() => Promise<T>} fn The asynchronous function to invoke.
     * @returns {Promise<T>} The result of the invoked function if it succeeds.
     */
    private async invokePasskeyApi<T>(
      session: string,
      fn: () => Promise<T>,
    ): Promise<T> {
      try {
        return await fn();
      } catch (error) {
        if (error instanceof Error) {
          const service = new ClientEvents(this.config.getConfig());
          service.reportError(session, error);
        }
        throw error;
      }
    }
  }
  
  export default Passkeys;
  