// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type TxCompleteRequestBody = {
    /**
     * This attribute contains the authenticator data returned by the authenticator.
     */
    authenticatorData: string;
    /**
     * Base64 encoded byte array which is a JSON-compatible serialization of client data
     * passed to the authenticator by the client in order to generate this assertion.
     * The exact JSON serialization MUST be preserved, as the hash of the serialized
     * client data has been computed over it.
     */
    clientData: string;
    /**
     * Identified of the passkey credential.
     */
    keyHandle: string;
    /**
     * An opaque object containing session data.
     */
    session: string;
    /**
     * Base64 encoded the raw signature returned from the authenticator.
     */
    signature: string;
  };
  