// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { RegCompleteRequestBody } from "../models/RegCompleteRequestBody";
import type { RegInitRequestBody } from "../models/RegInitRequestBody";
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
import type { RegInit } from "../models/RegInit";
import type { JWT } from "../models/JWT";
export class RegService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Complete WebAuthn registration flow
   * @returns JWT OK response.
   * @throws ApiError
   */
  public regRegComplete({
    requestBody,
  }: {
    requestBody: RegCompleteRequestBody;
  }): CancelablePromise<JWT> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/reg/complete",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        403: `forbidden: Forbidden response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
  /**
   * Start WebAuthn registration flow
   * @returns RegInit OK response.
   * @throws ApiError
   */
  public regRegInit({
    requestBody,
    userAgent,
    authorization,
  }: {
    requestBody: RegInitRequestBody;
    /**
     * Raw user-agent header as set by a browser
     */
    userAgent?: string;
    /**
     * JWT Authorization header
     */
    authorization?: string;
  }): CancelablePromise<RegInit> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/reg/init",
      headers: {
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        401: `unauthorized: Unauthorized response.`,
        403: `forbidden: Forbidden response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
}
