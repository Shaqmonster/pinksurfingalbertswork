// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { UserLogin } from "./UserLogin";
export type AuthCodeVerifyRequestBody = {
  /**
   * Authentication code
   */
  authCode: string;
  user: UserLogin;
};
