// Copyright (C) LoginID

import { LoginIDBase, MFA, Utils } from "../controllers";
import type { LoginIDConfig } from "../controllers";
import { applyMixins } from "../helpers";

interface LoginIDMfa extends MFA, Utils {}

class LoginIDMfa extends LoginIDBase {
  constructor(config: LoginIDConfig) {
    super(config);
  }
}

applyMixins(LoginIDMfa, [LoginIDBase, MFA, Utils]);

export default LoginIDMfa;
