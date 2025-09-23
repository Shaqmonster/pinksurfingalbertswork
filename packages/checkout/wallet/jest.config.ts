// Copyright (C) LoginID

module.exports = {
    testMatch: ["<rootDir>/src/**/*.test.ts"],
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    displayName: "checkout-wallet",
    moduleNameMapper: {
      "^@loginid/core/(.*)$": "<rootDir>/../../core/src/$1",
      "^@loginid/core$": "<rootDir>/../../core/src",
      "^@loginid/checkout-commons$": "<rootDir>/../commons/src",
    },
  };
  