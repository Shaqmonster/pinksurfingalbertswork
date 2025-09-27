// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { PubKeyCredentialDescriptor } from "./PubKeyCredentialDescriptor";
export type PublicKeyCredentialRequestOptions = {
  /**
   * A list of PublicKeyCredentialDescriptor objects representing public key
   * credentials acceptable to the caller, in descending order of the caller’s
   * preference (the first item in the list is the most preferred credential,
   * and so on down the list).
   */
  allowCredentials?: Array<PubKeyCredentialDescriptor>;
  /**
   * This base64 encoded byte array represents a challenge that the selected
   * authenticator signs, along with other data, when producing an authentication
   * assertion.
   */
  challenge: string;
  /**
   * Additional parameters requesting additional processing by the client and
   * authenticator. For example, if transaction confirmation is sought from the
   * user, then the prompt string might be included as an extension.
   */
  extensions?: Record<string, any>;
  /**
   * The relying party identifier claimed by the caller. If omitted, its value will
   * be the CredentialsContainer object’s relevant settings object's origin's
   * effective domain.
   */
  rpId?: string;
  /**
   * Specifies a time, in milliseconds, that the caller is willing
   * to wait for the call to complete. The value is treated as a
   * hint, and MAY be overridden by the client.
   */
  timeout?: number;
  /**
   * User verification requirement
   */
  userVerification?: "required" | "preferred" | "discouraged";
};
