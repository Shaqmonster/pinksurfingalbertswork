// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type PubKeyCredentialDescriptor = {
    /**
     * Base64 encoded byte array of the public key identifier.
     */
    id: string;
    transports?: Array<
      "usb" | "nfc" | "ble" | "internal" | "hybrid" | "cable" | "smart-card"
    >;
    /**
     * The valid credential types.
     */
    type: "public-key";
  };
  