// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { AuthCodeRequestSMSRequestBody } from "../models/AuthCodeRequestSMSRequestBody";
import type { AuthCodeVerifyRequestBody } from "../models/AuthCodeVerifyRequestBody";
import type { AuthCompleteRequestBody } from "../models/AuthCompleteRequestBody";
import type { AuthInitRequestBody } from "../models/AuthInitRequestBody";
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
import type { AuthCode } from "../models/AuthCode";
import type { AuthInit } from "../models/AuthInit";
import type { JWT } from "../models/JWT";
export class AuthService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Complete WebAuthn authentication
   * @returns JWT OK response.
   * @throws ApiError
   */
  public authAuthComplete({
    requestBody,
  }: {
    requestBody: AuthCompleteRequestBody;
  }): CancelablePromise<JWT> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/auth/complete",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        404: `forbidden: Not Found response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Start WebAuthn authentication flow
   * @returns AuthInit OK response.
   * @throws ApiError
   */
  public authAuthInit({
    requestBody,
    userAgent,
  }: {
    requestBody: AuthInitRequestBody;
    /**
     * Raw user-agent header as set by a browser
     */
    userAgent?: string;
  }): CancelablePromise<AuthInit> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/auth/init",
      headers: {
        "User-Agent": userAgent,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        403: `forbidden: Forbidden response.`,
        404: `not_found: Not Found response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Request OTP code by an authenticated user
   * An authenticated user can request an authentication code directly using this
   * method. The code can be used for authentication from another device.
   * @returns AuthCode OK response.
   * @throws ApiError
   */
  public authAuthCodeRequest({
    authorization,
  }: {
    /**
     * JWT Authorization header
     */
    authorization?: string;
  }): CancelablePromise<AuthCode> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/auth/otp",
      headers: {
        Authorization: authorization,
      },
      errors: {
        401: `unauthorized: Unauthorized response.`,
        403: `forbidden: Forbidden response.`,
        404: `not_found: Not Found response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Request OTP code to be sent via email.
   * Send authentication code to the provided email. The SMS will only be sent
   * if the email address is known to the application, however, this method will
   * return success regardless.
   * @returns void
   * @throws ApiError
   */
  public authAuthCodeRequestEmail({
    requestBody,
  }: {
    requestBody: AuthCodeRequestSMSRequestBody;
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/auth/otp/email",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        404: `not_found: Not Found response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Request OTP code to be sent via SMS.
   * Send authentication code to the provided phone number. The SMS will only be
   * sent if the phone is registered with the application, however, it will return
   * success regardless.
   * @returns void
   * @throws ApiError
   */
  public authAuthCodeRequestSms({
    requestBody,
  }: {
    requestBody: AuthCodeRequestSMSRequestBody;
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/auth/otp/sms",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        404: `not_found: Not Found response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Verify authentication code and return JWT access token with appropriate scopes
   * @returns JWT OK response.
   * @throws ApiError
   */
  public authAuthCodeVerify({
    requestBody,
  }: {
    requestBody: AuthCodeVerifyRequestBody;
  }): CancelablePromise<JWT> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/auth/otp/verify",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        404: `not_found: Not Found response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
}
