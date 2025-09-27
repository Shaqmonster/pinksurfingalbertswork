// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { DeviceInfo } from "./DeviceInfo";
export type Passkey = {
  /**
   * AAGUID of passkey provider
   */
  aaguid: string;
  /**
   * Timestamp in RFC3339 format.
   */
  createdAt: string;
  /**
   * Credential available on multiple devices
   */
  credentialSynced?: boolean;
  /**
   * Internal passkey ID that uniquely identifies a passkey
   */
  id: string;
  /**
   * Last use timestamp in rfc3339 format
   */
  lastUsedAt?: string;
  lastUsedFromDevice?: DeviceInfo;
  /**
   * Name of the passkey
   */
  name: string;
  /**
   * Name of the passkey provider
   */
  providerName?: string;
};
