// Copyright (C) LoginID

import {
    IframeMethod,
    MESSAGES_CHANNEL,
    MessageData,
    verifyMessage,
  } from "@loginid/checkout-commons";
  import { ChildMessagesAPI, ChildMethods } from "./types";
  import { AnyAsyncFunction } from "../types";
  
  /**
   * Class representing child message handling.
   */
  export class ChildMessages implements ChildMessagesAPI {
    /**
     * The methods available for message handling.
     * @private
     * @type {ChildMethods}
     */
    private methods: ChildMethods = {};
    /**
     * The allowed origin for message communication.
     * @private
     * @readonly
     * @type {string}
     */
    private allowedOrigin: string;
    /**
     * Indicates if the handshake is complete.
     * @private
     * @type {boolean}
     */
    private isHandshakeComplete: boolean = false;
  
    /**
     * The queue of pending message events to be processed.
     * @private
     * @type {MessageEvent[]}
     */
    private static pendingRequests: MessageEvent[] = [];
  
    /**
     * Creates an instance of ChildMessages.
     * @param {string} allowedOrigin - The allowed origin for message communication.
     */
    constructor(allowedOrigin: string = "*") {
      this.allowedOrigin = allowedOrigin;
      this.handleMessage = this.handleMessage.bind(this);
      window.addEventListener("message", this.handleMessage);
    }
  
    /**
     * Handles incoming messages.
     * @private
     * @param {MessageEvent} event - The message event.
     */
    private async handleMessage(event: MessageEvent) {
      if (!verifyMessage(event, this.allowedOrigin)) return;
  
      const { id, method, type } = event.data as MessageData;
      const options = { targetOrigin: this.allowedOrigin };
  
      if (type === "handshake") {
        const data = {
          id,
          channel: MESSAGES_CHANNEL,
          type: "handshake-response",
        } as MessageData;
        event.source?.postMessage(data, options);
        this.allowedOrigin = event.origin;
        this.isHandshakeComplete = true;
        return;
      }
  
      if (!this.isHandshakeComplete) return;
  
      if (!method) return;
  
      if (this.methods[method]) {
        this.processMessage(event);
      } else {
        ChildMessages.pendingRequests.push(event);
        return;
      }
    }
  
    /**
     * Processes all pending message requests.
     * @public
     * @async
     * @returns {Promise<void>}
     */
    public async processPendingRequests(): Promise<void> {
      while (ChildMessages.pendingRequests.length > 0) {
        const event = ChildMessages.pendingRequests.shift();
        if (event) {
          this.processMessage(event);
        }
      }
    }
  
    /**
     * Processes a single message event.
     * @private
     * @async
     * @param {MessageEvent} event - The message event to process.
     * @returns {Promise<void>}
     */
    private async processMessage(event: MessageEvent): Promise<void> {
      const { id, method, params } = event.data as MessageData;
      const options = { targetOrigin: this.allowedOrigin };
  
      if (!method || !this.methods[method]) return;
  
      try {
        const result = await this.methods[method](params);
        const data = {
          id,
          channel: MESSAGES_CHANNEL,
          type: "message-response",
          data: result,
        } as MessageData;
        event.source?.postMessage(data, options);
      } catch (error) {
        if (error instanceof Error) {
          const data = {
            id,
            channel: MESSAGES_CHANNEL,
            type: "error",
            data: { message: error.message },
          } as MessageData;
          event.source?.postMessage(data, options);
        }
      }
    }
  
    /**
     * Adds a method for message handling.
     * @param {string} name - The name of the method.
     * @param {AnyAsyncFunction} fn - The function to handle the method.
     */
    public addMethod(name: IframeMethod, fn: AnyAsyncFunction) {
      this.methods[name] = fn;
    }
  
    /**
     * Retrieves the list of pending message requests, waiting up to 0.5s for any to arrive.
     * @public
     * @async
     * @returns {Promise<MessageEvent[]>} A shallow copy of the pending message events.
     */
    public async getPendingRequests(): Promise<MessageEvent[]> {
      if (ChildMessages.pendingRequests.length > 0) {
        return [...ChildMessages.pendingRequests];
      }
  
      return new Promise<MessageEvent[]>((resolve) => {
        const timeout = setTimeout(() => {
          cleanup();
          resolve([]);
        }, 3000);
  
        const interval = setInterval(() => {
          if (ChildMessages.pendingRequests.length > 0) {
            cleanup();
            resolve([...ChildMessages.pendingRequests]);
          }
        }, 10);
  
        const cleanup = () => {
          clearTimeout(timeout);
          clearInterval(interval);
        };
      });
    }
  }
  