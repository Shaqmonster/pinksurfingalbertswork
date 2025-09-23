// Copyright (C) LoginID

import {
    AuthResult,
    Message,
    RequestAndSendOtpOptions,
    ValidateOtpOptions,
  } from "../types";
  import {
    AuthCodeRequestSMSRequestBody,
    AuthCodeVerifyRequestBody,
  } from "@loginid/core/api";
  import { LoginIDBase, LoginIDConfig } from "@loginid/core/controllers";
  import { AbortControllerManager } from "@loginid/core/webauthn";
  import { passkeyOptions, toAuthResult } from "../lib/defaults";
  
  /**
   * Extends LoginIDBase to support OTP methods.
   */
  class OTP extends LoginIDBase {
    /**
     * Initializes a new instance of OTP with the provided configuration.
     *
     * @param {LoginIDConfig} config Configuration object for LoginID.
     */
    constructor(config: LoginIDConfig) {
      super(config);
    }
  
    /**
     * This method verifies the OTP and returns an authorization token, which can be used with the `passkeyCreate()`
     * method to create a new passkey. The authorization token has a short validity period and should be used immediately.
     *
     * @param {string} username Username to validate with.
     * @param {string} otp OTP to validate.
     * @param {ValidateOtpOptions} options Additional authentication options.
     * @returns {Promise<AuthResult>} Result of the authentication operation.
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
     * // Button click handler to generate a code with passkey
     * async function handleRequestOTPButtonClick() {
     *   const username = "billy@loginid.io";
     *
     *   try {
     *     // Request OTP with passkey
     *     const result = await lid.requestOtp(username);
     *     // Extract the OTP from the response
     *     const otp = result.code;
     *
     *     // Authenticate with the OTP
     *     // You can authenticate on another device with this OTP
     *     const authenticateResult = await lid.validateOtp(username, otp);
     *     // Handle the authentication result
     *     console.log("Authentication Result:", authenticateResult);
     *   } catch (error) {
     *     // Handle errors
     *     console.error("Error during authentication:", error);
     *   }
     * }
     *
     * // Attach the click handler to a button
     * const requestOtpButton = document.getElementById("requestOtpButton");
     * requestOtpButton.addEventListener("click", handleRequestOTPButtonClick);
     * ```
     */
    async validateOtp(
      username: string,
      otp: string,
      options: ValidateOtpOptions = {},
    ): Promise<AuthResult> {
      const opts = passkeyOptions(username, "", options);
      const request: AuthCodeVerifyRequestBody = {
        authCode: otp,
        user: {
          username: username,
          usernameType: opts.usernameType,
        },
      };
  
      const response = await this.service.auth.authAuthCodeVerify({
        requestBody: request,
      });
  
      const result = toAuthResult(response);
  
      // Renew abort controller since authentication is complete
      AbortControllerManager.renewWebAuthnAbortController();
  
      this.session.setJwtCookie(result.token);
  
      return result;
    }
  
    /**
     * This method requests an OTP from the backend to be sent via the selected method. The method of delivery should be based on
     * the user's choice from the list of available options. This can be found in the result of `authenticateWithPasskey`
     * method as `fallbackOptions`.
     *
     * @param {string} username Username to request and send the OTP to.
     * @param {Message} method Method to send the code, either 'email' or 'sms'. Default is 'email'.
     * @param {RequestAndSendOtpOptions} options Additional options for sending the OTP.
     * @returns {Promise<void>} A promise that resolves when the operation completes successfully.
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
     * const username = "billy@loginid.io";
     *
     * async function sendUserOTPHandler() {
     *   try {
     *     // Send OTP to a user via email
     *     await lid.requestAndSendOtp(username, "email");
     *     console.log("OTP sent successfully.");
     *   } catch (error) {
     *     console.error("Error sending code:", error);
     *   }
     * }
     *
     * const sendOtpButton = document.getElementById("button");
     * sendOtpButton.addEventListener("click", sendUserOTPHandler);
     * ```
     */
    async requestAndSendOtp(
      username: string,
      method: Message = "email",
      options: RequestAndSendOtpOptions = {},
    ): Promise<void> {
      const opts = passkeyOptions(username, "", options);
      const request: AuthCodeRequestSMSRequestBody = {
        user: {
          username: username,
          usernameType: opts.usernameType,
        },
      };
  
      switch (method) {
        case "email":
          await this.service.auth.authAuthCodeRequestEmail({
            requestBody: request,
          });
          break;
  
        case "sms":
          await this.service.auth.authAuthCodeRequestSms({
            requestBody: request,
          });
          break;
  
        default:
          throw new Error("Invalid message method");
      }
    }
  }
  
  export default OTP;
  