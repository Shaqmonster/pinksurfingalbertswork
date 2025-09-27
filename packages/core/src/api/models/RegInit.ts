// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { PublicKeyCredentialCreationOptions } from "./PublicKeyCredentialCreationOptions";
/**
 * FIDO2 registration response
 */
export type RegInit = {
  /**
   * An action to be performed by the front-end to complete the registration flow.
   */
  action: "proceed" | "signIn" | "fail";
  registrationRequestOptions: PublicKeyCredentialCreationOptions;
  /**
   * An opaque object containing session data.
   */
  session: string;
};
