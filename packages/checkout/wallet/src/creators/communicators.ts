// Copyright (C) LoginID

import { WalletCommunicator } from "../communicators/types";
import { WalletToMerchant } from "../communicators";
import { ChildMessages } from "../messages";

/**
 * Factory function to create a `WalletCommunicator` instance.
 *
 * This sets up the communication bridge between the Wallet (in iframe)
 * and the Merchant (parent), using `ChildMessages` as the underlying message handler.
 *
 * @returns {WalletCommunicator} A new instance of `WalletToMerchant` configured for message handling.
 */
export const createWalletCommunicator = (): WalletCommunicator => {
  const childApi = new ChildMessages();
  return new WalletToMerchant(childApi);
};
