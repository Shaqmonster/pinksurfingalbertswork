// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { SubmitRequestBody } from "../models/SubmitRequestBody";
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
import type { Session } from "../models/Session";
export class ClientEventsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Report a client side event.
   * Report a client event. It does not change state of the flow.
   * @returns Session OK response.
   * @throws ApiError
   */
  public clientEventsSubmit({
    requestBody,
    authorization,
  }: {
    requestBody: SubmitRequestBody;
    /**
     * JWT Authorization header
     */
    authorization?: string;
  }): CancelablePromise<Session> {
    return this.httpRequest.request({
      method: "POST",
      url: "/fido2/v2/client-events/submit",
      headers: {
        Authorization: authorization,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `bad_request: Bad Request response.`,
        401: `unauthorized: Unauthorized response.`,
        404: `not_found: Not Found response.`,
        500: `internal_error: Internal Server Error response.`,
      },
    });
  }
}
