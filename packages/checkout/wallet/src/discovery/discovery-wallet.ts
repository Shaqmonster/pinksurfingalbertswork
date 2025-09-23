// Copyright (C) LoginID

import { DiscoverResult, DiscoverStrategy } from "@loginid/checkout-commons";
import { WalletTrustIdStore } from "@loginid/core/store";

/**
 * Class responsible for discovering user and authentication contexts.
 * Implements the DiscoverStrategy to implement the discover method.
 */
export class CheckoutDiscovery implements DiscoverStrategy {
  /**
   * Determines the appropriate authentication flow based on available user information.
   *
   * It attempts to retrieve the only available wallet checkout ID from the checkout ID store.
   * If found and is valid, the method returns `EMBED`.
   * If not found or is invalid, it defaults to `REDIRECT`.
   *
   * @returns {Promise<DiscoverResult>} A promise resolving to the discovery result,
   * indicating the appropriate flow (`EMBED` or `REDIRECT`).
   */
  async discover(): Promise<DiscoverResult> {
    // Attempt to find the first one trust ID
    const store = new WalletTrustIdStore();
    const hasValidTrustId = await store.isCheckoutIdValid();
    if (hasValidTrustId) {
      return { flow: "EMBED" };
    } else {
      return { flow: "REDIRECT" };
    }
  }
}
