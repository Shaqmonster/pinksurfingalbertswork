// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { PasskeyOptions } from "./PasskeyOptions";
import type { Application } from "./Application";
import type { DeviceInfo } from "./DeviceInfo";
import type { User } from "./User";
export type RegInitRequestBody = {
  app: Application;
  deviceInfo: DeviceInfo;
  passkeyOptions?: PasskeyOptions;
  /**
   * TrustIDs provided with the request
   */
  trustItems?: Record<string, string>;
  user?: User;
};
