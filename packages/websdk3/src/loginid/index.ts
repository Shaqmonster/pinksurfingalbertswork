// Copyright (C) LoginID

import { LoginIDBase, Utils } from "@loginid/core/controllers";
import PasskeyManager from "./controllers/passkey-manager";
import { LoginIDConfig } from "@loginid/core/controllers";
import { applyMixins } from "@loginid/core/helpers";
import Passkeys from "./controllers/passkeys";
import OTP from "./controllers/otp";

interface LoginIDWebSDK extends Passkeys, OTP, PasskeyManager, Utils {}

class LoginIDWebSDK extends LoginIDBase {
  constructor(config: LoginIDConfig) {
    super(config);
  }
}

applyMixins(LoginIDWebSDK, [LoginIDBase, Passkeys, OTP, PasskeyManager, Utils]);

export default LoginIDWebSDK;
