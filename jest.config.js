module.exports = {
  setupFilesAfterEnv: ["jest-enzyme"],
  testEnvironment: "enzyme",
  testMatch: [
    "<rootDir>/src/js/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/src/js/**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|svg|ttf|woff|woff2)$":
      "<rootDir>/src/js/__mocks__/fileMock.js",
    "\\.(css|scss)$": "<rootDir>/src/js/__mocks__/styleMock.js"
  }
};
