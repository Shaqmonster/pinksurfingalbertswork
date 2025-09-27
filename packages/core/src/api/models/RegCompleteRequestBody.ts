// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { CreationResult } from "./CreationResult";
export type RegCompleteRequestBody = {
  creationResult: CreationResult;
  /**
   * Passkey name that will be shown to the user in passkey list.
   */
  passkeyName?: string;
  /**
   * An opaque object containing session data.
   */
  session: string;
};
