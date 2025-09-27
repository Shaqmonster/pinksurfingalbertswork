// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { MfaThirdPartyAuthVerifyRequestBody } from "../models/MfaThirdPartyAuthVerifyRequestBody";
import type { MfaOtpRequestResponseBody } from "../models/MfaOtpRequestResponseBody";
import type { MfaPasskeyAuthRequestBody } from "../models/MfaPasskeyAuthRequestBody";
import type { MfaOtpRequestRequestBody } from "../models/MfaOtpRequestRequestBody";
import type { MfaPasskeyRegRequestBody } from "../models/MfaPasskeyRegRequestBody";
import type { MfaOtpVerifyRequestBody } from "../models/MfaOtpVerifyRequestBody";
import type { MfaBeginRequestBody } from "../models/MfaBeginRequestBody";
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
import type { MfaNext } from "../models/MfaNext";
import type { Mfa } from "../models/Mfa";
export class MfaService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Begin and appropriate flow for the provided username.
   * Perform pre-authentication.
   * @returns MfaNext OK response.
   * @throws ApiError
   */
  public mfaMfaBegin({
    requestBody,
    userAgent,
  }: {
    requestBody: MfaBeginRequestBody;
    /**
     * Raw user-agent header as set by a browser
     */
    userAgent?: string;
  }): CancelablePromise<MfaNext> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/mfa/begin",
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
   * Request OTP authentication using one of the available methods.
   * Request OTP.
   * @returns MfaOtpRequestResponseBody OK response.
   * @throws ApiError
   */
  public mfaMfaOtpRequest({
    requestBody,
    authorization,
  }: {
    requestBody: MfaOtpRequestRequestBody;
    /**
     * JWT Authorization header
     */
    authorization?: string;
  }): CancelablePromise<MfaOtpRequestResponseBody> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/mfa/otp/request",
      headers: {
        Authorization: authorization,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        401: `unauthorized: Unauthorized response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Confirm OTP received in a previous step.
   * Verify OTP received by one of the methods.
   * @returns Mfa OK response.
   * @throws ApiError
   */
  public mfaMfaOtpVerify({
    requestBody,
    authorization,
  }: {
    requestBody: MfaOtpVerifyRequestBody;
    /**
     * JWT Authorization header
     */
    authorization?: string;
  }): CancelablePromise<Mfa> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/mfa/otp/verify",
      headers: {
        Authorization: authorization,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        401: `additional_auth_required: Unauthorized response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Authenticate using passkey.
   * Authenticate with a passkeys.
   * @returns Mfa OK response.
   * @throws ApiError
   */
  public mfaMfaPasskeyAuth({
    requestBody,
    authorization,
  }: {
    requestBody: MfaPasskeyAuthRequestBody;
    /**
     * JWT Authorization header
     */
    authorization?: string;
  }): CancelablePromise<Mfa> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/mfa/passkey/auth",
      headers: {
        Authorization: authorization,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        401: `additional_auth_required: Unauthorized response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Register a new passkey.
   * Register a new passkey.
   * @returns Mfa OK response.
   * @throws ApiError
   */
  public mfaMfaPasskeyReg({
    requestBody,
    authorization,
  }: {
    requestBody: MfaPasskeyRegRequestBody;
    /**
     * JWT Authorization header
     */
    authorization?: string;
  }): CancelablePromise<Mfa> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/mfa/passkey/reg",
      headers: {
        Authorization: authorization,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        401: `unauthorized: Unauthorized response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Transaction confirmation using passkey.
   * Confirm a transaction with a passkey.
   * @returns Mfa OK response.
   * @throws ApiError
   */
  public mfaMfaPasskeyTx({
    requestBody,
    authorization,
  }: {
    requestBody: MfaPasskeyAuthRequestBody;
    /**
     * JWT Authorization header
     */
    authorization?: string;
  }): CancelablePromise<Mfa> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/mfa/passkey/tx",
      headers: {
        Authorization: authorization,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        401: `unauthorized: Unauthorized response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Verify auth token created by a third party via management API.
   * Verify authentication token received from a third party.
   * @returns Mfa OK response.
   * @throws ApiError
   */
  public mfaMfaThirdPartyAuthVerify({
    requestBody,
    authorization,
  }: {
    requestBody: MfaThirdPartyAuthVerifyRequestBody;
    /**
     * JWT Authorization header
     */
    authorization?: string;
  }): CancelablePromise<Mfa> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/mfa/third-party/verify",
      headers: {
        Authorization: authorization,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        401: `additional_auth_required: Unauthorized response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
}
