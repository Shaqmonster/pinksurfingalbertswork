// Copyright (C) LoginID

import {
    MfaBeginOptions,
    MfaFactorName,
    MfaInfo,
    MfaSessionResult,
    RemainingFactor,
    RequireProps,
  } from "../controllers/types";
  import { LoginIDTokenSet } from "../types";
  import { MfaNext } from "../api";
  
  /**
   * Merges provided options with default values for passkey options.
   *
   * @param {string} username Username for which the passkey options are being created.
   * @param {MfaBeginOptions} options Options to merge with default values.
   * @returns {MfaBeginOptions} The complete set of passkey options with defaults applied.
   */
  export const mfaOptions = (
    username: string,
    options: MfaBeginOptions,
  ): RequireProps<MfaBeginOptions, "usernameType" | "displayName"> => {
    return {
      ...options,
      usernameType: options.usernameType || "other",
      displayName: options.displayName || username,
    };
  };
  
  /**
   * Converts an `MfaNext` result into an `MfaInfo` object.
   *
   * @param {MfaNext} mfaNextResult - The result from an MFA authentication step.
   * @param {string} [username] - The username associated with the MFA session (optional).
   * @returns {MfaInfo} - The structured MFA information.
   */
  export const toMfaInfo = (
    mfaNextResult: MfaNext,
    username?: string,
  ): MfaInfo => {
    return {
      username: username,
      flow: mfaNextResult.flow,
      session: mfaNextResult.session,
      next: mfaNextResult.next,
    };
  };
  
  /**
   * Converts MFA information and token set into an `MfaSessionResult` object.
   *
   * @param {MfaInfo | null} [info] - The MFA session information, if available.
   * @param {LoginIDTokenSet} [tokenSet] - The token set containing authentication tokens.
   * @returns {MfaSessionResult} - The structured MFA session result.
   */
  export const toMfaSessionDetails = (
    info?: MfaInfo | null,
    tokenSet?: LoginIDTokenSet,
  ): MfaSessionResult => {
    const remainingFactors: RemainingFactor[] =
      info?.next?.map((factor) => {
        const { name, label, desc } = factor.action;
        const result: RemainingFactor = {
          type: name,
          label,
          ...(desc && { description: desc }),
        };
  
        if (factor.options) {
          const options = factor.options
            .filter(
              (option) =>
                (name === "otp:sms" || name === "otp:email") && option.label,
            )
            .map((option) => option.label!)
            .filter(Boolean);
  
          if (options.length) {
            result.options = options;
          }
  
          if (
            name === "passkey:reg" ||
            name === "passkey:auth" ||
            name === "passkey:tx"
          ) {
            const passkeyOption = factor.options.find((option) => option.value);
            if (passkeyOption) result.value = passkeyOption.value;
          }
        }
  
        return result;
      }) || [];
  
    const factorPriority: MfaFactorName[] = [
      "passkey:reg",
      "passkey:auth",
      "passkey:tx",
      "otp:sms",
      "otp:email",
      "external",
    ];
  
    const nextAction = factorPriority.find((name) =>
      info?.next?.some((factor) => factor.action.name === name),
    );
  
    return {
      username: info?.username,
      ...(info?.username && { username: info.username }),
      flow: info?.flow,
      ...(info?.flow && { flow: info.flow }),
      remainingFactors: remainingFactors,
      ...(nextAction && { nextAction }),
      isComplete: !!tokenSet?.accessToken || !!tokenSet?.payloadSignature,
      ...(info?.session && { session: info.session }),
      ...(tokenSet?.idToken && { idToken: tokenSet?.idToken }),
      ...(tokenSet?.accessToken && { accessToken: tokenSet?.accessToken }),
      ...(tokenSet?.refreshToken && { refreshToken: tokenSet?.refreshToken }),
      ...(tokenSet?.payloadSignature && {
        payloadSignature: tokenSet?.payloadSignature,
      }),
    };
  };
  