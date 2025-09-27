// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { MfaOption } from "./MfaOption";
/**
 * Next Action to be performed.
 */
export type MfaAction = {
  action: {
    /**
     * Action description
     */
    desc?: string;
    /**
     * Human readable action label
     */
    label: string;
    /**
     * Next Action to be performed.
     */
    name:
      | "passkey:reg"
      | "passkey:auth"
      | "passkey:tx"
      | "otp:email"
      | "otp:sms"
      | "otp:verify"
      | "external";
  };
  /**
   * Additional options associated with the action.
   */
  options?: Array<MfaOption>;
};
