// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { MfaAction } from "./MfaAction";
/**
 * Authentication response will contain authzToken on success of list of available options for the next step.
 */
export type MfaNext = {
  /**
   * The current flow type.
   */
  flow?: "signIn" | "signUp";
  /**
   * Additional info displayed to the user
   */
  msg: string;
  /**
   * Message code
   */
  msgCode: string;
  next?: Array<MfaAction>;
  /**
   * An opaque "session" object to be used with the subsequent API call for maintaining flow state.
   */
  session?: string;
};
