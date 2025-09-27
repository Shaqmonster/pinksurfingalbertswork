// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { TxCompleteRequestBody } from "../models/TxCompleteRequestBody";
import type { TxInitRequestBody } from "../models/TxInitRequestBody";
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
import type { TxComplete } from "../models/TxComplete";
import type { TxInit } from "../models/TxInit";
export class TxService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Complete transaction confirmation
   * @returns TxComplete OK response.
   * @throws ApiError
   */
  public txTxComplete({
    requestBody,
  }: {
    requestBody: TxCompleteRequestBody;
  }): CancelablePromise<TxComplete> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/tx/complete",
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
   * Start transaction confirmation flow
   * @returns TxInit OK response.
   * @throws ApiError
   */
  public txTxInit({
    requestBody,
  }: {
    requestBody: TxInitRequestBody;
  }): CancelablePromise<TxInit> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/tx/init",
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
