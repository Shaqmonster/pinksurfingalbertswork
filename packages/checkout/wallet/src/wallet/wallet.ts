// Copyright (C) LoginID

import {
    LoginIDConfig,
    MfaBeginOptions,
    MfaFactorName,
    MfaSessionResult,
  } from "@loginid/core/controllers";
  import {
    CheckoutBeginFlowOptions,
    CheckoutPerformActionOptions,
  } from "../types";
  import {
    CheckoutIdLocalStorage,
    WalletTrustIdStore,
  } from "@loginid/core/store";
  import { DiscoverResult, EmbeddedContextData } from "@loginid/checkout-commons";
  import { ValidationError } from "@loginid/core/errors";
  import { createWalletCommunicator } from "../creators";
  import { WalletCommunicator } from "../communicators";
  import { CheckoutDiscovery } from "../discovery";
  import { LoginIDMfa } from "@loginid/core/mfa";
  
  /**
   * A specialized authentication class built on top of LoginID's MFA flow,
   * designed specifically for handling authentication and identity trust during a checkout process.
   *
   * This class integrates with embedded contexts (e.g., iframes), allowing wallet-based authentication
   * and the propagation of trusted identity back to the merchant securely.
   */
  class LoginIDWalletAuth {
    private mfa: LoginIDMfa;
    private communicator: WalletCommunicator;
  
    /**
     * Initializes a new instance of the LoginIDWalletAuth.
     *
     * @param {LoginIDConfig} config - The configuration object for LoginID services.
     */
    constructor(config: LoginIDConfig) {
      this.communicator = createWalletCommunicator();
      this.mfa = new LoginIDMfa(config);
    }
  
    /**
     * Performs discovery to identify the appropriate authentication flow for the wallet experience.
     *
     * This method should be called **immediately on page load** of the wallet landing page. It determines
     * whether the user is accessing the wallet via an embedded iframe or requires a fallback method.
     *
     * The discovery result includes available authentication factors and flow preferences.
     * It also sends the result back to the parent context (if embedded) to allow the merchant
     * to proceed accordingly.
     *
     * @example
     * ```tsx
     * useEffect(() => {
     *   const runDiscovery = async () => {
     *     await lid.discover();
     *   };
     *   runDiscovery();
     * }, []);
     * ```
     *
     * @returns {Promise<DiscoverResult>} - A promise that resolves with the available discovery result.
     */
    async discover(): Promise<DiscoverResult> {
      const discovery = new CheckoutDiscovery();
      const result = await discovery.discover();
      this.communicator.sendData("DISCOVER", async () => result);
      return result;
    }
  
    /**
     * Begins the MFA authentication flow for a checkout session.
     *
     * If executed within an embedded context, the method attempts to retrieve the `checkoutId`
     * from the parent message (if not already provided). It initiates the MFA session tied
     * to a specific transaction payload.
     *
     * @param {CheckoutBeginFlowOptions} options - Contains the transaction payload and optional identifiers.
     * @returns {Promise<MfaSessionResult>} - A promise that resolves with the initiated MFA session.
     */
    async beginFlow(
      options: CheckoutBeginFlowOptions,
    ): Promise<MfaSessionResult> {
      const eData =
        await this.communicator.retrievePotentialData<EmbeddedContextData>(
          "EMBED",
        );
      const checkoutId = options.checkoutId || eData?.checkoutId;
      const txPayload = options.txPayload;
  
      if (!checkoutId) {
        throw new ValidationError(
          "`checkoutId is required",
          "ERROR_VALIDATION_EMPTY_INPUT",
          "checkoutId",
        );
      }
  
      if (!txPayload) {
        throw new ValidationError(
          "`txPayload` is required",
          "ERROR_VALIDATION_EMPTY_INPUT",
          "txPayload",
        );
      }
  
      const opts: MfaBeginOptions = {
        checkoutId: checkoutId,
        txPayload: txPayload,
      };
  
      CheckoutIdLocalStorage.persistCheckoutId(checkoutId || "");
  
      return await this.mfa.beginFlow(options.username || "", opts);
    }
  
    /**
     * Performs an MFA action using the provided factor and optional payload.
     *
     * In the context of checkout, this method is used for two critical use cases:
     *
     * - **Passkey Registration (`passkey:reg`)**: Used during account creation to register a passkey (e.g., WebAuthn).
     * - **Passkey Transaction Confirmation (`passkey:tx`)**: Confirms a specific transaction securely using a passkey.
     *
     * Other supported factors include standard WebAuthn login (`passkey:auth`), one-time passwords (`otp:email`, `otp:sms`, `otp:verify`),
     * or external authentication via third-party providers.
     *
     * After a successful authentication, this method will attempt to communicate the result
     * (e.g., a checkout trust token or identifier) back to the parent frame (if embedded).
     *
     * @param {MfaFactorName} factorName - The MFA factor to be executed.
     * @param {CheckoutPerformActionOptions} [options={}] - The payload for the factor.
     * @returns {Promise<MfaSessionResult>} - A promise resolving to the updated MFA session result.
     */
    async performAction(
      factorName: MfaFactorName,
      options: CheckoutPerformActionOptions = {},
    ): Promise<MfaSessionResult> {
      // NOTE: This may be a temporary fix
      if (factorName === "passkey:tx" && options.txPayload) {
        const checkoutId = CheckoutIdLocalStorage.getCheckoutId();
        const opts: MfaBeginOptions = {
          checkoutId: checkoutId,
          txPayload: options.txPayload,
        };
  
        await this.mfa.beginFlow("", opts);
      }
  
      const result = await this.mfa.performAction(factorName, options);
      if (result.payloadSignature || result.accessToken) {
        const callback = async () => ({});
  
        this.communicator.sendData("EMBED", callback, {});
  
        const passkeyFactors = new Set([
          "passkey:reg",
          "passkey:auth",
          "passkey:tx",
        ]);
        if (passkeyFactors.has(factorName)) {
          const store = new WalletTrustIdStore();
          store.markCheckoutIdAsValid();
        }
      }
  
      return result;
    }
  }
  
  export default LoginIDWalletAuth;
  