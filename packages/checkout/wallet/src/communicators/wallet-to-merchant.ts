// Copyright (C) LoginID

import {
    ReceiverType,
    buildQueryParamsAndRedirect,
  } from "@loginid/checkout-commons";
  import { SendDataOptions, WalletCommunicator } from "./types";
  import { ChildMessagesAPI } from "../messages";
  import { ResultCallback } from "../types";
  import { isInIframe } from "../helpers";
  
  /**
   * A communicator implementation used by the Wallet to handle communication with the merchant.
   *
   * This class facilitates message passing between an embedded iframe (Wallet) and the parent (Merchant).
   * It supports retrieving pending messages and registering callbacks for communication events like discovery or transaction confirmation.
   */
  export class WalletToMerchant implements WalletCommunicator {
    /**
     * The API for child iframe message communication.
     * @private
     * @readonly
     * @type {ChildMessagesAPI}
     */
    private readonly childIframeApi: ChildMessagesAPI;
  
    /**
     * Constructs a new instance of WalletToMerchant.
     *
     * @param {ChildMessagesAPI} childIframeApi - An instance of the message API used to communicate with the parent.
     */
    constructor(childIframeApi: ChildMessagesAPI) {
      this.childIframeApi = childIframeApi;
    }
  
    /**
     * Retrieves any pending request data sent from the parent to the iframe, based on the given receiver type.
     *
     * @template T - The expected type of the retrieved data.
     * @param {ReceiverType} type - The type of communication context (e.g., "EMBED").
     * @returns {T | void} - The retrieved data if available, or `void` if no matching request is found or not in an iframe.
     * @throws {Error} Throws if the receiver type is invalid.
     */
    public async retrievePotentialData<T>(type: ReceiverType): Promise<T | void> {
      if (!isInIframe()) {
        return;
      }
  
      switch (type) {
        case "EMBED": {
          const getPendingRequests =
            await this.childIframeApi.getPendingRequests();
  
          // Find the first message request
          for (const request of getPendingRequests) {
            const { type } = request.data;
            if (type === "message") {
              return request.data.params as T;
            }
          }
  
          return;
        }
  
        default:
          throw new Error(`Invalid receiver type: ${type}`);
      }
    }
  
    /**
     * Registers a callback to handle specific types of incoming requests and processes them accordingly.
     * If not in an iframe, and a redirect URL is provided, it will perform a redirect instead.
     *
     * @template T - The type of the expected incoming data.
     * @template U - The type of the data to be returned by the callback.
     * @param {ReceiverType} type - The communication flow type (e.g., "DISCOVER", "EMBED").
     * @param {ResultCallback<T, U>} callback - A function to handle the received data and return a response.
     * @param {SendDataOptions} options - Options to control behavior such as redirection fallback.
     * @throws {Error} Throws if the receiver type is invalid.
     */
    public sendData<T, U>(
      type: ReceiverType,
      callback: ResultCallback<T, U>,
      options: SendDataOptions,
    ): void {
      if (!isInIframe()) {
        const redirectUrl = options.redirectUrl;
        if (redirectUrl) {
          buildQueryParamsAndRedirect(redirectUrl, {});
        }
        return;
      }
  
      switch (type) {
        case "DISCOVER": {
          this.childIframeApi.addMethod("discover", callback);
          break;
        }
  
        case "EMBED": {
          this.childIframeApi.addMethod("sign_transaction", callback);
          break;
        }
  
        default:
          throw new Error(`Invalid receiver type: ${type}`);
      }
  
      this.childIframeApi.processPendingRequests();
    }
  }
  