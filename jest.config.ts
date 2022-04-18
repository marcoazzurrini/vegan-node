export default {
  globals: {
    extensionsToTreatAsEsm: [".ts", ".js"],
    "ts-jest": {
      useESM: true,
    },
  },
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  preset: "ts-jest/presets/js-with-ts-esm",
  transform: {
    "^.+\\.ts?$": "babel-jest",
  },
  modulePathIgnorePatterns: ["testUtils"],
};
