// Copyright (C) LoginID

import { AuthzTokenOptions, LoginIDTokenSet, SessionInfo } from "../types";
import { deleteCookie, getCookie, setCookie } from "../utils/browser";
import { LoginIDConfigValidator } from "../validators";
import { LoginIDConfig } from "../controllers";
import { parseJwt } from "../utils/crypto";
import { Mfa } from "../api";

export class SessionManager {
  /**
   * Holds the configuration settings for the LoginID integration, including API base URL.
   */
  protected config: LoginIDConfigValidator;

  /**
   * Initializes a new instance of SessionManager with the provided configuration.
   *
   * @param {LoginIDConfig} config Configuration object for LoginID.
   */
  constructor(config: LoginIDConfig) {
    this.config = new LoginIDConfigValidator(config);
  }

  /**
   * Retrieves the authentication token from the provided options or from cookies if not available in options.
   *
   * @param {AuthzTokenOptions} options Options containing the token.
   * @returns {string} The authentication token.
   */
  public getToken(options: AuthzTokenOptions): string {
    if (options.authzToken) {
      return options.authzToken;
    } else {
      const token = this.getJwtCookie();
      if (token) {
        return token;
      } else {
        return "";
      }
    }
  }

  /**
   * Retrieves the currently authenticated user's session information.
   *
   * @returns {LoginIDUser | null} The currently authenticated user's information, including username and id.
   * It will return null if user is not authenticated
   */
  public getSessionInfo(): SessionInfo | null {
    if (!this.isLoggedIn()) {
      return null;
    }
    const data = parseJwt(
      this.getJwtCookie() || this.retrieveToken("accessToken") || "{}",
    );
    const user: SessionInfo = {
      username: data.username,
      id: data.sub,
    };
    return user;
  }

  /**
   * Returns the dynamic Cookie name holding the authorization token for the given application.
   *
   * @returns {string} The name of the cookie
   */
  public getJwtCookieName(): string {
    return `LoginID_${this.config.getAppId()}_token`;
  }

  /**
   * Returns the dynamic Cookie name holding the identification token for the given user.
   *
   * @returns {string} The name of the cookie
   */
  public getIdTokenName(): string {
    return `LoginID_${this.config.getAppId()}_id_token`;
  }

  /**
   * Returns the dynamic Cookie name holding the access token for the given user.
   *
   * @returns {string} The name of the cookie
   */
  public getAccessTokenName(): string {
    return `LoginID_${this.config.getAppId()}_access_token`;
  }

  /**
   * Returns the dynamic Cookie name holding the refresh token for the given user.
   *
   * @returns {string} The name of the cookie
   */
  public getRefreshTokenName(): string {
    return `LoginID_${this.config.getAppId()}_refresh_token`;
  }

  /**
   * Returns the dynamic Cookie name holding the payload signature for the given user.
   *
   * @returns {string} The name of the cookie
   */
  public getPayloadSignatureName(): string {
    return `LoginID_${this.config.getAppId()}_payload_signature`;
  }

  /**
   * Set jwt token to local Cookie
   *
   * @param {string} jwt Configuration object for LoginID API, including the base URL.
   */
  public setJwtCookie(jwt: string) {
    const token = parseJwt(jwt);
    const expiry = new Date(token.exp * 1000).toUTCString();
    const cookie = `${this.getJwtCookieName()}=${jwt}; expires=${expiry}`;
    setCookie(cookie);
  }

  /**
   * Retrieves the JWT access token.
   *
   * @returns {string | undefined} The JWT access token.
   */
  public getJwtCookie(): string | undefined {
    return getCookie(this.getJwtCookieName());
  }

  /**
   * Checks if the user is logged in.
   *
   * @returns {boolean}
   */
  public isLoggedIn(): boolean {
    return !!this.getJwtCookie() || !!this.retrieveToken("accessToken");
  }

  /**
   * Deletes the jwt cookie.
   */
  public logout() {
    deleteCookie(this.getJwtCookieName());
    deleteCookie(this.getIdTokenName());
    deleteCookie(this.getAccessTokenName());
    deleteCookie(this.getRefreshTokenName());
    deleteCookie(this.getPayloadSignatureName());
  }

  /**
   * Set the successful result token set to local Cookie.
   *
   * @param {Mfa} result Configuration object for LoginID API, including the base URL.
   */
  public setTokenSet(result: Mfa) {
    const { accessToken, idToken, payloadSignature, refreshToken } = result;

    const setTokenCookie = (name: string, token: string) => {
      if (!token) return;
      const tokenPayload = parseJwt(token);
      const expiry = tokenPayload?.exp
        ? new Date(tokenPayload.exp * 1000).toUTCString()
        : "";
      document.cookie = `${name}=${token}; Expires=${expiry};`;
    };

    setTokenCookie(this.getIdTokenName(), idToken);
    setTokenCookie(this.getAccessTokenName(), accessToken);
    setTokenCookie(this.getRefreshTokenName(), refreshToken);
    setTokenCookie(this.getPayloadSignatureName(), payloadSignature);
  }

  /**
   * Retrieves a specific token by type.
   *
   * @param {string} tokenType The type of token to retrieve ('idToken', 'accessToken', 'refreshToken', 'payloadSignature').
   * @returns {string | undefined} The token value, or null if not found.
   */
  public retrieveToken(
    tokenType: "idToken" | "accessToken" | "refreshToken" | "payloadSignature",
  ): string {
    const tokenNameMap = {
      idToken: this.getIdTokenName(),
      accessToken: this.getAccessTokenName(),
      refreshToken: this.getRefreshTokenName(),
      payloadSignature: this.getPayloadSignatureName(),
    };
    const tokenName = tokenNameMap[tokenType];
    // NOTE: Later check for undefined and attempt to use refresh token with service
    return getCookie(tokenName) || "";
  }

  /**
   * Retrieves the complete token set as a JavaScript object.
   *
   * @returns {LoginIDTokenSet} The token set object.
   */
  public getTokenSet(): LoginIDTokenSet {
    return {
      idToken: this.retrieveToken("idToken"),
      accessToken: this.retrieveToken("accessToken"),
      refreshToken: this.retrieveToken("refreshToken"),
      payloadSignature: this.retrieveToken("payloadSignature"),
    };
  }
}
