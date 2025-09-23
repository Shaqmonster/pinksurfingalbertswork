// Copyright (C) LoginID

import {
    isConditionalUIAvailable,
    isPlatformAuthenticatorAvailable,
  } from "@loginid/core/utils/browser";
  import {
    WebAuthnHelper,
    createPasskeyCredential,
    getPasskeyCredential,
  } from "@loginid/core/webauthn";
  import { AbortError, PasskeyError } from "@loginid/core/errors";
  import { LoginIDMfa } from "@loginid/core/mfa";
  import LoginIDWebSDK from "./loginid";
  
  export {
    createPasskeyCredential,
    getPasskeyCredential,
    isConditionalUIAvailable,
    isPlatformAuthenticatorAvailable,
    AbortError,
    LoginIDMfa,
    LoginIDWebSDK,
    PasskeyError,
    WebAuthnHelper,
  };
  export type { Passkey, PasskeyCollection } from "@loginid/core/api";
  
  export * from "./loginid/types";
  
  export default LoginIDWebSDK;
  