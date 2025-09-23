// Copyright (C) LoginID

import { AbortError } from "../errors/abort";

export class AbortControllerManager {
  /**
   * AbortController to manage the lifecycle of asynchronous WebAuthn requests,
   * allowing them to be cancelled when another request needs to be made.
   */
  public static abortController: AbortController = new AbortController();

  /**
   * Cancels the current WebAuthn request by aborting the active AbortController
   * and throwing an AbortError with a custom message.
   */
  public static abortWebAuthnRequest = () => {
    const error = new AbortError("Cancelling current WebAuthn request");
    AbortControllerManager.abortController.abort(error);
  };

  /**
   * Refreshes an existing WebAuthn AbortController by aborting the current request and initiating a new controller.
   * This function is useful for handling scenarios where a WebAuthn request needs to be programmatically cancelled
   * to handle new user interactions.
   */
  public static renewWebAuthnAbortController = () => {
    AbortControllerManager.abortWebAuthnRequest();
    const controller = new AbortController();
    AbortControllerManager.abortController = controller;
  };

  /**
   * Assigns a new AbortController to manage WebAuthn requests after aborting the
   * current one. This is useful when a specific AbortController needs to be used
   * or swapped in response to external triggers or interactions.
   *
   * @param controller - The new AbortController instance to be used.
   */
  public static assignWebAuthnAbortController = (
    controller: AbortController,
  ) => {
    AbortControllerManager.abortWebAuthnRequest();
    AbortControllerManager.abortController = controller;
  };
}
