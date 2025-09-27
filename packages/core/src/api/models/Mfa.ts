// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

/**
 * Authentication response will contain authzToken on success of list of available options for the next step.
 */
export type Mfa = {
    /**
     * An authorization token (JWT) confirming successful authentication.
     */
    accessToken: string;
    /**
     * Device ID
     */
    deviceId?: string;
    /**
     * The current flow type.
     */
    flow: "signIn" | "signUp";
    /**
     * An authorization token (JWT) confirming successful authentication.
     */
    idToken: string;
    /**
     * Base64 encoded payload object
     */
    payload: string;
    /**
     * A digital signature (JWS) of the payload.
     */
    payloadSignature: string;
    /**
     * An authorization token (JWT) confirming successful authentication.
     */
    refreshToken: string;
  };
  