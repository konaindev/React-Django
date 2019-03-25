module.exports = {
  setupFilesAfterEnv: ["jest-enzyme"],
  testEnvironment: "enzyme",
  testMatch: [
    "<rootDir>/src/js/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/src/js/**/?(*.)+(spec|test).[jt]s?(x)"
  ]
};
