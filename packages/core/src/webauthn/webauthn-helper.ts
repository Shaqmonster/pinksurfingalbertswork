// Copyright (C) LoginID

import {
    AuthCompleteRequestBody,
    AuthInit,
    RegCompleteRequestBody,
    RegInit,
  } from "../api";
  import { createPasskeyCredential, getPasskeyCredential } from "./webauthn";
  import { GetNavigatorCredentialOptions, Transports } from "../types";
  import { AbortControllerManager } from "./abort-controller";
  import { bufferToBase64Url } from "../utils/crypto";
  
  export class WebAuthnHelper {
    /**
     * A helper function that attempts public-key credential authentication using WebAuthn API. It is designed to be used with LoginID's
     * passkey authentication flow. The function takes an authentication initialization response and returns an authentication completion request body.
     */
    static async getNavigatorCredential(
      authInitResponseBody: AuthInit,
      options: GetNavigatorCredentialOptions = {},
    ) {
      const { assertionOptions, session } = authInitResponseBody;
  
      if (!options.abortController) {
        AbortControllerManager.renewWebAuthnAbortController();
        options.abortController = AbortControllerManager.abortController;
      } else {
        AbortControllerManager.assignWebAuthnAbortController(
          options.abortController,
        );
      }
  
      const credential = await getPasskeyCredential(assertionOptions, options);
      const response = credential.response as AuthenticatorAssertionResponse;
  
      const authCompleteRequestBody: AuthCompleteRequestBody = {
        assertionResult: {
          authenticatorData: bufferToBase64Url(response.authenticatorData),
          clientDataJSON: bufferToBase64Url(response.clientDataJSON),
          credentialId: credential.id,
          signature: bufferToBase64Url(response.signature),
          ...(response.userHandle && {
            userHandle: bufferToBase64Url(response.userHandle),
          }),
        },
        session: session,
      };
  
      return authCompleteRequestBody;
    }
  
    /**
     * A helper function that creates a public-key credential using WebAuthn API.
     * It processes the response body from registration initialization and returns
     * a registration completion request body.
     */
    static async createNavigatorCredential(regInitResponseBody: RegInit) {
      const { registrationRequestOptions, session } = regInitResponseBody;
  
      AbortControllerManager.renewWebAuthnAbortController();
  
      const credential = await createPasskeyCredential(
        registrationRequestOptions,
      );
      const response = credential.response as AuthenticatorAttestationResponse;
  
      const publicKey = response.getPublicKey && response.getPublicKey();
      const publicKeyAlg =
        response.getPublicKeyAlgorithm && response.getPublicKeyAlgorithm();
      const authenticatorData =
        response.getAuthenticatorData && response.getAuthenticatorData();
      const transports =
        response.getTransports && (response.getTransports() as Transports);
  
      const regCompleteRequestBody: RegCompleteRequestBody = {
        creationResult: {
          attestationObject: bufferToBase64Url(response.attestationObject),
          clientDataJSON: bufferToBase64Url(response.clientDataJSON),
          credentialId: credential.id,
          ...(publicKey && { publicKey: bufferToBase64Url(publicKey) }),
          ...(publicKeyAlg && { publicKeyAlgorithm: publicKeyAlg }),
          ...(authenticatorData && {
            authenticatorData: bufferToBase64Url(authenticatorData),
          }),
          ...(transports && { transports: transports }),
        },
        session: session,
      };
  
      return regCompleteRequestBody;
    }
  }
  