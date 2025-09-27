// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type AppError = {
    msg: string;
    /**
     * Message code
     */
    msgCode:
      | "bad_request"
      | "unauthorized"
      | "forbidden"
      | "not_found"
      | "internal_error";
  };
  