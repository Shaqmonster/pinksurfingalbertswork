// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { ApiRequestOptions } from "./ApiRequestOptions";
import type { CancelablePromise } from "./CancelablePromise";
import { BaseHttpRequest } from "./BaseHttpRequest";
import { request as __request } from "./request";
import type { OpenAPIConfig } from "./OpenAPI";

export class FetchHttpRequest extends BaseHttpRequest {
  constructor(config: OpenAPIConfig) {
    super(config);
  }

  /**
   * Request method
   * @param options The request options from the service
   * @returns CancelablePromise<T>
   * @throws ApiError
   */
  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return __request(this.config, options);
  }
}
