// Copyright (C) LoginID

import { LoginIDConfig } from "../controllers";

export class LoginIDConfigValidator {
  /**
   * Holds the configuration settings for the LoginID integration, including API base URL and optional app ID.
   */
  private readonly config: LoginIDConfig;

  /**
   * Constructs a new instance of the LoginIDConfigValidator class, initializing with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID API, including the base URL and optional app ID.
   */
  constructor(config: LoginIDConfig) {
    this.config = config;
  }

  /**
   * Retrieves the application ID from the configuration or extracts it from the base URL if not provided.
   * @returns {string} The application ID.
   * @throws {Error} If the app ID is not found in the configuration or the base URL, throws an error.
   */
  getAppId(): string {
    if (this.config.appId) {
      return this.config.appId;
    }

    // Regex to capture the subdomain part before the first period in the baseUrl
    const pattern = /https?:\/\/([^.]+)\./;
    const match = this.config.baseUrl.match(pattern);
    if (match) {
      return match[1];
    } else {
      throw new Error("Invalid LoginID base URL. App ID not found.");
    }
  }

  /**
   * Retrieves the original LoginID configuration object.
   * @returns {LoginIDConfig} The configuration object.
   */
  getConfig(): LoginIDConfig {
    return this.config;
  }
}
