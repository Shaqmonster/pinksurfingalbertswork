// Copyright (C) LoginID

import {
    PublicKeyCredentialCreationOptions,
    PublicKeyCredentialRequestOptions,
  } from "../api";
  import {
    MfaFactor,
    MfaFactorName,
    MfaInfo,
    MfaPerformActionOptions,
  } from "../controllers";
  import { parseJwt } from "../utils/crypto";
  import { LoginIDError } from "../errors";
  
  /**
   * Utility class for validating parameters related to LoginID MFA operations.
   */
  export class LoginIDParamValidator {
    /**
     * Validates and extracts necessary parameters for performing an MFA factor.
     *
     * @param {MfaFactorName} factorName - The name of the MFA factor being validated.
     * @param {MfaInfo | null} info - The current MFA session information.
     * @param {MfaPerformActionOptions} options - The provided options for performing the MFA factor.
     * @returns {Pick<Complete<MfaPerformActionOptions>, "payload" | "session">} - The validated session and payload.
     */
    public static mfaOptionValidator(
      factorName: MfaFactorName,
      info: MfaInfo | null,
      options: MfaPerformActionOptions,
    ): Pick<Required<MfaPerformActionOptions>, "payload" | "session"> {
      const { session = info?.session, payload = "" } = options;
  
      if (!session) {
        throw new LoginIDError("A session is required to perform MFA factor.");
      }
  
      if (payload) {
        return { session, payload };
      }
  
      const canFindPayloadInInfo = new Set<MfaFactorName>([
        "passkey:reg",
        "passkey:auth",
        "passkey:tx",
        "otp:email",
        "otp:sms",
      ]);
      if (!info?.next || !canFindPayloadInInfo.has(factorName)) {
        throw new LoginIDError("Payload is required to perform MFA factor.");
      }
  
      const factor = info.next.find((f) => f.action.name === factorName);
      if (!factor) {
        throw new LoginIDError(`No matching factor found for ${factorName}.`);
      }
  
      const getFactorPayload = (factor: MfaFactor, key?: string): string => {
        if (!factor.options?.length) {
          throw new LoginIDError(`Payload is required for ${factorName}.`);
        }
  
        const isPasskey = new Set<MfaFactorName>([
          "passkey:reg",
          "passkey:auth",
          "passkey:tx",
        ]);
        if (isPasskey.has(factorName)) {
          return factor.options[0].value;
        }
  
        let selectedOption: string | undefined;
  
        // If key is provided (e.g., "email:primary"), find the option with that key
        if (key) {
          selectedOption = factor.options.find(
            (option: any) => option.name === key,
          )?.label;
        } else {
          selectedOption = factor.options[0]?.label;
        }
  
        if (!selectedOption) {
          throw new LoginIDError(`Contact is not found for ${factorName}.`);
        }
  
        return selectedOption;
      };
  
      switch (factorName) {
        case "passkey:reg":
        case "passkey:auth":
        case "passkey:tx":
          return { session, payload: getFactorPayload(factor) };
  
        case "otp:email":
          return { session, payload: getFactorPayload(factor, "email:primary") };
  
        case "otp:sms":
          return { session, payload: getFactorPayload(factor) };
      }
  
      throw new LoginIDError("Payload is required to perform MFA factor.");
    }
  
    /**
     * Validates and parses a passkey payload.
     *
     * @param {string} payload - The encoded passkey payload.
     * @returns {PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions} - The parsed passkey options.
     */
    public static validatePasskeyPayload(
      payload: string,
    ): PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions {
      if (!payload) {
        throw new LoginIDError("Payload is required for passkeys.");
      }
  
      const options = parseJwt("." + payload);
      if (!options) {
        throw new LoginIDError("Invalid payload for passkeys.");
      }
  
      if (LoginIDParamValidator.isPublicKeyCredentialCreationOptions(options)) {
        return options;
      }
  
      if (LoginIDParamValidator.isPublicKeyCredentialRequestOptions(options)) {
        return options;
      }
  
      throw new LoginIDError("Invalid payload for passkey.");
    }
  
    /**
     * Checks if the given object is a valid `PublicKeyCredentialCreationOptions`.
     *
     * @param {any} options - The object to check.
     * @returns {options is PublicKeyCredentialCreationOptions} - `true` if valid, otherwise `false`.
     */
    public static isPublicKeyCredentialCreationOptions(
      options: any,
    ): options is PublicKeyCredentialCreationOptions {
      return !!(
        options.rp?.id &&
        options.challenge &&
        options.pubKeyCredParams &&
        options.user?.id
      );
    }
  
    /**
     * Checks if the given object is a valid `PublicKeyCredentialRequestOptions`.
     *
     * @param {any} options - The object to check.
     * @returns {options is PublicKeyCredentialRequestOptions} - `true` if valid, otherwise `false`.
     */
    public static isPublicKeyCredentialRequestOptions(
      options: any,
    ): options is PublicKeyCredentialRequestOptions {
      return !!(
        options.rpId &&
        options.challenge &&
        options.allowCredentials &&
        options.userVerification
      );
    }
  }
  