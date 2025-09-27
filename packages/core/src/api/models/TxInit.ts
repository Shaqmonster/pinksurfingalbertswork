// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { PublicKeyCredentialRequestOptions } from "./PublicKeyCredentialRequestOptions";
/**
 * Transaction Confirmation Init response
 */
export type TxInit = {
  assertionOptions: PublicKeyCredentialRequestOptions;
  /**
   * An opaque object containing session data.
   */
  session: string;
  /**
   * Internal transaction identifier
   */
  txId: string;
};
