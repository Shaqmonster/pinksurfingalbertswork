// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { DeviceInfo } from "./DeviceInfo";
import type { User } from "./User";
export type MfaBeginRequestBody = {
  deviceInfo?: DeviceInfo;
  /**
   * Payload to be signed
   */
  payload?: string;
  /**
   * TrustIDs provided with the request
   */
  trustItems?: Record<string, string>;
  user?: User;
};
