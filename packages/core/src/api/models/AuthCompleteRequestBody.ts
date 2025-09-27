// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { AuthenticatorAssertionResponse } from "./AuthenticatorAssertionResponse";
export type AuthCompleteRequestBody = {
  assertionResult: AuthenticatorAssertionResponse;
  /**
   * An opaque object containing session data.
   */
  session: string;
};
