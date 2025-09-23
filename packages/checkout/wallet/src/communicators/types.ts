// Copyright (C) LoginID

import { ReceiverType } from "@loginid/checkout-commons";
import { ResultCallback } from "../types";

/**
 * Options for configuring how data is sent in a communication flow.
 *
 * @property {string} [redirectUrl] - An optional URL to redirect to after the data is sent.
 * This is typically used in flows like "REDIRECT" where a return path is needed.
 */
export interface SendDataOptions {
  redirectUrl?: string;
}

/**
 * Interface for a communicator used by the wallet to wait for a request and send a response.
 */
export interface WalletCommunicator {
  /**
   * Retrieves any previously received data associated with the given communication type.
   *
   * @template T - The expected type of the retrieved data.
   * @param {ReceiverType} type - The type of communication flow to retrieve data for
   * (e.g., "REDIRECT", "DISCOVER").
   * @returns {T | undefined} - The data associated with the given type, or `undefined`
   * if no such data has been received.
   */
  retrievePotentialData<T>(type: ReceiverType): Promise<T | void>;

  /**
   * Registers a callback to handle incoming data of a specific type and send a response.
   *
   * @template T - The type of the incoming request data.
   * @template U - The type of the response data to be sent back.
   * @param {ReceiverType} type - Specifies the communication flow or operation (e.g., "REDIRECT", "DISCOVER").
   * @param {ResultCallback<T, U>} callback - A function that processes the received data and returns a result.
   * @param {SendDataOptions} options - Optional settings to customize the behavior of the data sending process,
   * such as providing a `redirectUrl` for redirect-based flows.
   * This function is invoked when a request of the specified type is received.
   */
  sendData<T, U>(
    type: ReceiverType,
    callback: ResultCallback<T, U>,
    options?: SendDataOptions,
  ): void;
}
