// Copyright (C) LoginID
//

module.exports = {
    testMatch: ["<rootDir>/src/**/*.test.ts"],
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    displayName: "websdk3",
    passWithNoTests: true,
  };
  