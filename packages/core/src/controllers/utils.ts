// Copyright (C) LoginID

import { LoginIDConfig, VerifyConfigResult } from "./types";
import { ApiError, AuthInitRequestBody } from "../api";
import { defaultDeviceInfo } from "../utils/browser";
import { LoginIDBase } from "./base";
import { MfaStore } from "../store";

export class Utils extends LoginIDBase {
  /**
   * Initializes a new Utils instance with the provided configuration.
   *
   * @param {LoginIDConfig} config Configuration object for LoginID.
   */
  constructor(config: LoginIDConfig) {
    super(config);
  }

  /**
   * Validates the application's configuration settings and provides a suggested correction if any issues are detected.
   *
   * @returns {Promise<VerifyConfigResult>} The result of the verification process.
   * @example
   * ```javascript
   * import { LoginIDWebSDK } from "@loginid/websdk3";
   *
   * // Obtain credentials from LoginID
   * const BASE_URL = process.env.BASE_URL;
   *
   * // Initialize the SDK with your configuration
   * const config = {
   *   baseUrl: BASE_URL,
   * };
   *
   * const lid = new LoginIDWebSDK(config);
   *
   * async function checkConfig() {
   *   const result = await lid.verifyConfigSettings();
   *
   *   if (result.isValid) {
   *     console.log('Configuration is valid');
   *   } else {
   *     console.error(`Error: ${result.message} (Code: ${result.code})`);
   *     console.info(`Solution: ${result.solution}`);
   *   }
   * }
   *
   * checkConfig();
   *
   * // Attach the click handler to a button
   * const checkConfigButton = document.getElementById("button");
   * checkConfigButton.addEventListener("click", checkConfig);
   * ```
   */
  public async verifyConfigSettings(): Promise<VerifyConfigResult> {
    const result: VerifyConfigResult = {
      isValid: true,
    };

    try {
      this.config.getAppId();
    } catch {
      result.isValid = false;
      result.solution = "Please verify that your base URL is correct.";
      result.code = "invalid_app_id";
      result.message = "Invalid app ID";
      return result;
    }

    try {
      const deviceInfo = await defaultDeviceInfo();

      const requestBody: AuthInitRequestBody = {
        app: {
          id: this.config.getAppId(),
        },
        deviceInfo: deviceInfo,
        user: {
          username: "",
          usernameType: "other",
        },
      };

      await this.service.auth.authAuthInit({ requestBody });
    } catch (error) {
      result.isValid = false;
      result.solution =
        "Verify that your application exists and the base URL is correct.";
      result.code = "unknown_error";
      result.message = "Unknown error.";

      if (error instanceof ApiError) {
        result.code = error.body.msgCode || "unknown_error";
        result.message =
          error.body.msg || error.body.message || "Unknown error.";
      }

      return result;
    }

    return result;
  }

  /**
   * Check whether the user of the current browser session is authenticated and returns user info.
   * This info is retrieved locally and no requests to backend are made.
   *
   * @returns {SessionInfo | null} The currently authenticated user's information, including username and id.
   * @example
   * ```javascript
   * import { LoginIDWebSDK } from "@loginid/websdk3";
   *
   * // Obtain credentials from LoginID
   * const BASE_URL = process.env.BASE_URL;
   *
   * // Initialize the SDK with your configuration
   * const config = {
   *   baseUrl: BASE_URL,
   * };
   *
   * // Use the SDK components for signup and signin
   * const lid = new LoginIDWebSDK(config);
   * const username = "billy@loginid.io";
   *
   * try {
   *   // Retrieve session information
   *   await lid.authenticateWithPasskey(username);
   *   const sessionInfo = lid.getSessionInfo();
   *   console.log("Session Information:", sessionInfo);
   * } catch (error) {
   *   console.error("Error retrieving session information:", error);
   * }
   * ```
   */
  public getSessionInfo() {
    return this.session.getSessionInfo();
  }

  /**
   * Clears current user session. This method is executed locally and it just deletes authorization token from local Cookies.
   *
   * @returns {boolean}
   * @example
   * ```javascript
   * import { LoginIDWebSDK } from "@loginid/websdk3";
   *
   * // Obtain credentials from LoginID
   * const BASE_URL = process.env.BASE_URL;
   *
   * // Initialize the SDK with your configuration
   * const config = {
   *   baseUrl: BASE_URL,
   * };
   *
   * // Use the SDK components for signup and signin
   * const lid = new LoginIDWebSDK(config);
   *
   * try {
   *   // Retrieve user information
   *   await lid.authenticateWithPasskey(username);
   *   lid.logout();
   *   const info = lid.getSessionInfo();
   *   // false
   *   console.log("Is user signed in?", info !== null);
   * } catch (error) {
   *   console.error("Error:", error);
   * }
   * ```
   */
  public logout() {
    const appId = this.config.getAppId();

    this.session.logout();

    MfaStore.persistInfo(appId, { next: [] });
  }
}
