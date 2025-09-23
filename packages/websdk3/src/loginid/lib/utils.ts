// Copyright (C) LoginID

import { AuthInit } from "@loginid/core/api";
import { FallbackOptions } from "../types";

/**
 * Combines the fallback and cross-authentication methods from the authentication initialization response
 * into a single array representing all available alternative authentication methods.
 *
 * @param {AuthInit} authInitRes The authentication initialization response containing available methods.
 * @returns {FallbackOptions} An array representing both fallback and cross-authentication methods.
 */
export const mergeFallbackOptions = (
  authInitRes: AuthInit,
): FallbackOptions => {
  return [...authInitRes.crossAuthMethods, ...authInitRes.fallbackMethods];
};
