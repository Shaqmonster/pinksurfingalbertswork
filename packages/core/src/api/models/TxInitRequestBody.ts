// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type TxInitRequestBody = {
    /**
     * Random string
     */
    nonce: string;
    /**
     * Payload of transaction
     */
    txPayload: string;
    /**
     * Type of transaction
     */
    txType: string;
    /**
     * Username of user
     */
    username: string;
  };
  