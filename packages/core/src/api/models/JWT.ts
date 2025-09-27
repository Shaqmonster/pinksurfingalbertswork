// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type JWT = {
    /**
     * Device ID
     */
    deviceId?: string;
    /**
     * JWT access token
     */
    jwtAccess: string;
    /**
     * Passkey ID
     */
    passkeyId?: string;
    /**
     * User ID
     */
    userId: string;
  };
  