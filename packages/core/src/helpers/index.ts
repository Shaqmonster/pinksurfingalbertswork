// Copyright (C) LoginID

import {
    b2a,
    base64EncodeUrl,
    generateRandomId,
    signWithES256PrivateKey,
  } from "../utils/crypto";
  import { TrustIDClaims } from "../types";
  
  /**
   * Along with traditional OO hierarchies, another popular way of building up classes from
   * reusable components is to build them by combining simpler partial classes.
   * https://www.typescriptlang.org/docs/handbook/mixins.html
   * */
  export const applyMixins = (derivedCtor: any, constructors: any[]) => {
    constructors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null),
        );
      });
    });
  };
  
  /**
   * Creates a Trust ID payload with the given parameters.
   * @param {string} [id] - The ID for the trust ID.
   * @returns {TrustIDClaims} The Trust ID payload.
   */
  export const toTrustIDPayload = (id?: string): TrustIDClaims => {
    if (!id) {
      id = generateRandomId();
    }
  
    const payload: TrustIDClaims = {
      id: id,
      // 1 min exp
      exp: Math.floor(Date.now() / 1000) + 60,
    };
  
    return payload;
  };
  
  /**
   * Signs a token payload using an ES256 private key.
   * @param {Record<string, any>} payload - The payload to sign.
   * @param {JsonWebKey} publicKeyJwk - The public key associated with the private key.
   * @param {CryptoKey} privateKey - The private key used for signing.
   * @returns {Promise<string>} The signed JWT.
   */
  export const signJwtWithJwk = async (
    payload: Record<string, any>,
    publicKeyJwk: JsonWebKey,
    privateKey: CryptoKey,
  ): Promise<string> => {
    const header = {
      alg: "ES256",
      jwk: publicKeyJwk,
    };
  
    const encodedHeader = base64EncodeUrl(b2a(JSON.stringify(header)));
    const encodedPayload = base64EncodeUrl(b2a(JSON.stringify(payload)));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const signature = await signWithES256PrivateKey(privateKey, unsignedToken);
  
    return `${unsignedToken}.${signature}`;
  };
  