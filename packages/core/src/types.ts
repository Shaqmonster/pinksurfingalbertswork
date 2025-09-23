// Copyright (C) LoginID

import { CreationResult } from "./api";

export type Transports = CreationResult["transports"];

export interface GetNavigatorCredentialOptions {
  autoFill?: boolean;
  abortController?: AbortController;
}

export interface GetPasskeyCredentialOptions {
  autoFill?: boolean;
  abortController?: AbortController;
}

export interface AuthzTokenOptions {
  authzToken?: string;
}

/**
 * General information about the current user session. Information is obtained from the stored authorization token.
 */
export interface SessionInfo {
  /**
   * Current authenticated user's username.
   */
  username: string;

  /**
   * Current authenticated user's ID.
   */
  id: string;
}

/**
 * Represents a stored checkout ID record.
 */
export interface CheckoutIDRecord {
  /**
   * Unique identifier for the checkout ID, derived from the checkout ID token.
   */
  id: string;

  /**
   * Cryptographic key pair used for signing and verification.
   */
  keyPair: CryptoKeyPair;

  /**
   * Indicates if the checkout ID has successfully been completed.
   */
  valid: boolean;
}

/**
 * Represents the claims included in a TrustID token.
 */
export interface TrustIDClaims {
  /**
   * Unique identifier for the Trust ID.
   */
  id: string;

  /**
   * Expiration time of the Trust ID token, represented as a Unix timestamp.
   */
  exp: number;
}

/**
 * Represents a stored Trust ID record in the trust store database.
 */
export interface TrustIDRecord {
  /**
   * Unique identifier for the Trust ID, derived from the TrustID token.
   */
  id: string;

  /**
   * Username associated with the Trust ID.
   */
  username: string;

  /**
   * Cryptographic key pair used for signing and verification.
   */
  keyPair: CryptoKeyPair;
}

/**
 * A set of tokens obtained upon login.
 */
export interface LoginIDTokenSet {
  /**
   * The ID token representing the authenticated session.
   */
  idToken: string;

  /**
   * The access token used for authorization.
   */
  accessToken: string;

  /**
   * The refresh token used to obtain new access tokens.
   */
  refreshToken: string;

  /**
   * A JSON Web Signature (JWS) that provides cryptographic proof of the payload's integrity.
   * Ensures that the authentication data has not been tampered with.
   */
  payloadSignature?: string;
}
