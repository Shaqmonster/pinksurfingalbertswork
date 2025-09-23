// Copyright (C) LoginID

module.exports = {
    testMatch: ["<rootDir>/packages/**/*.test.ts"],
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
    transformIgnorePatterns: ["/node_modules/"],
    projects: [
      "<rootDir>/packages/core",
      "<rootDir>/packages/websdk3",
      "<rootDir>/packages/checkout/commons",
      "<rootDir>/packages/checkout/merchant",
      "<rootDir>/packages/checkout/wallet",
    ],
  };
  