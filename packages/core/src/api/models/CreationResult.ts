// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type CreationResult = {
    /**
     * Base64 encoded byte array containing an attestation object, which is opaque to,
     * and cryptographically protected against tampering by, the client.
     */
    attestationObject: string;
    /**
     * A base64 encoded authenticator data structure encodes contextual bindings
     * made by the authenticator.
     */
    authenticatorData?: string;
    /**
     * Base64 encoded byte array which is a JSON-compatible serialization of client data
     * passed to the authenticator by the client in order to generate this credential.
     * The exact JSON serialization MUST be preserved, as the hash of the serialized
     * client data has been computed over it.
     */
    clientDataJSON: string;
    /**
     * A base64 encoded byte sequence identifying a public key credential
     * source and its authentication assertions.
     */
    credentialId: string;
    /**
     * Base64 encoded DER SubjectPublicKeyInfo of the new credential, or null if this is
     * not available.
     */
    publicKey?: string;
    publicKeyAlgorithm?: number;
    /**
     * These values are the transports that the authenticator is believed to support,
     * or an empty sequence if the information is unavailable.
     */
    transports?: Array<
      "usb" | "nfc" | "ble" | "internal" | "hybrid" | "cable" | "smart-card"
    >;
  };
  