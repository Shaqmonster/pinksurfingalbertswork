// Copyright (C) LoginID

import {
    DeletePasskeyOptions,
    ListPasskeysOptions,
    RenamePasskeyOptions,
  } from "../types";
  import type {
    PasskeyCollection,
    PasskeyRenameRequestBody,
  } from "@loginid/core/api";
  import { LoginIDBase, LoginIDConfig } from "@loginid/core/controllers";
  
  /**
   * Extends LoginIDBase to manage Passkeys, including listing, renaming, and deleting passkeys.
   */
  class PasskeyManager extends LoginIDBase {
    /**
     * Initializes a new instance of PasskeyManager with the provided configuration.
     *
     * @param {LoginIDConfig} config Configuration object for LoginID.
     */
    constructor(config: LoginIDConfig) {
      super(config);
    }
  
    /**
     * This method returns list of passkeys associated with the current user. The user must be fully authorized for this call to succeed.
     *
     * @param {ListPasskeysOptions} options Additional options for listing passkeys.
     * @returns {Promise<PasskeyCollection>} A collection of passkeys.
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
     * // Button click handler for signing in
     * async function handleSigninButtonClick() {
     *   const username = "billy@loginid.io";
     *
     *   try {
     *     // Sign in with a passkey
     *     await lid.authenticateWithPasskey(username);
     *
     *     // List all user credentials
     *     const passkeys = await lid.listPasskeys();
     *     // Handle the sign-in result
     *   } catch (error) {
     *     // Handle errors
     *     console.error("Error during obtaining passkeys:", error);
     *   }
     * }
     *
     * // Attach the click handler to a button
     * const signinButton = document.getElementById("signinButton");
     * signinButton.addEventListener("click", handleSigninButtonClick);
     * ```
     */
    async listPasskeys(
      options: ListPasskeysOptions = {},
    ): Promise<PasskeyCollection> {
      const token = this.session.getToken(options);
  
      return await this.service.passkeys.passkeysPasskeysList({
        authorization: token,
      });
    }
  
    /**
     * Renames a specified passkey by ID. The user must be fully authorized for this call to succeed.
     *
     * @param {string} id The ID of the passkey to rename.
     * @param {string} name The new name for the passkey.
     * @param {RenamePasskeyOptions} options Additional options for renaming the passkey.
     * @returns {Promise<void>} A promise that resolves when the operation completes successfully.
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
     * const passkeyId = "abc123";
     * const newCredName = "New Passkey Credential Name";
     *
     * // Rename the passkey user credential
     * try {
     *   // Signin with passkey
     *   await lid.authenticateWithPasskey(username);
     *
     *   // Find a way to retrieve passkey ID
     *   await lid.renamePasskey(passkeyId, newCredName);
     *   // Passkey credential successfully renamed
     * } catch (error) {
     *   // Handle errors
     *   console.error("Error during passkey credential renaming:", error);
     * }
     * ```
     */
    async renamePasskey(
      id: string,
      name: string,
      options: RenamePasskeyOptions = {},
    ): Promise<void> {
      const token = this.session.getToken(options);
  
      const passkeyRenameRequestBody: PasskeyRenameRequestBody = {
        name: name,
      };
  
      await this.service.passkeys.passkeysPasskeyRename({
        authorization: token,
        id: id,
        requestBody: passkeyRenameRequestBody,
      });
    }
  
    /**
     * Delete a specified passkey by ID from LoginID. The user must be fully authorized for this call to succeed.
     *
     * @param {string} id The ID of the passkey to delete.
     * @param {DeletePasskeyOptions} options Additional options for deleting the passkey.
     * @returns {Promise<void>} A promise that resolves when the operation completes successfully.
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
     * const passkeyId = "abc123";
     *
     * // Delete the passkey user credential
     * try {
     *   // Signin with passkey
     *   const signinResult = await lid.authenticateWithPasskey(username);
     *
     *   // Find a way to retrieve passkey ID
     *   await lid.deletePasskey(passkeyId);
     *   // Passkey credential successfully deleted
     * } catch (error) {
     *   // Handle errors
     *   console.error("Error deleting passkey:", error);
     * }
     * ```
     */
    async deletePasskey(
      id: string,
      options: DeletePasskeyOptions = {},
    ): Promise<void> {
      const token = this.session.getToken(options);
  
      await this.service.passkeys.passkeysPasskeyDelete({
        authorization: token,
        id: id,
      });
    }
  }
  
  export default PasskeyManager;
  