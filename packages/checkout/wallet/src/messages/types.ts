// Copyright (C) LoginID

import { IframeMethod } from "@loginid/checkout-commons";
import { AnyAsyncFunction } from "../types";

/**
 * Represents a collection of child methods.
 * @interface
 */
export interface ChildMethods {
  [key: string]: AnyAsyncFunction;
}

/**
 * Represents the API for child messages.
 * @interface
 */
export interface ChildMessagesAPI {
  /**
   * Processes all pending requests.
   * This method resolves or rejects each pending request based on the response received.
   *
   * @returns {Promise<void>} A promise that resolves when all pending requests have been processed.
   */

  processPendingRequests(): Promise<void>;
  /**
   * Adds a method to the collection of child methods.
   * This allows the child to handle specific method calls from the parent.
   *
   * @param {IframeMethod} name - The name of the method to add.
   * @param {AnyAsyncFunction} fn - The function to execute when the method is called.
   */
  addMethod(name: IframeMethod, fn: AnyAsyncFunction): void;

  /**
   * Retrieves the list of pending message requests.
   *
   * @returns {Promise<MessageEvent[]>} A shallow copy of the pending message events.
   */
  getPendingRequests(): Promise<MessageEvent[]>;
}
