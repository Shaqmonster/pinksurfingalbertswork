// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type User = {
    /**
     * Display Name
     */
    displayName?: string;
    /**
     * Username
     */
    username: string;
    /**
     * Username type
     */
    usernameType: "email" | "phone" | "other";
  };
  