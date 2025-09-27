// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

/**
 * Authentication response will contain authzToken on success of list of available options for the next step.
 */
export type Session = {
    /**
     * An opaque "session" object that shall be used with any subsequent calls.
     */
    session?: string;
  };
  