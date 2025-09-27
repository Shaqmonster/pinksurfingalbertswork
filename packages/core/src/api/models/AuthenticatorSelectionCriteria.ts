// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type AuthenticatorSelectionCriteria = {
    /**
     * Authenticator attachment modality
     */
    authenticatorAttachment?: "platform" | "cross-platform";
    /**
     * Resident key requirement
     */
    requireResidentKey?: boolean;
    /**
     * Resident key requirement
     */
    residentKey?: "discouraged" | "preferred" | "required";
    /**
     * User verification requirement
     */
    userVerification?: "required" | "preferred" | "discouraged";
  };
  