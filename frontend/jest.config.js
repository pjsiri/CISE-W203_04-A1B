// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy", // Mock SCSS/CSS modules
    "^@/(.*)$": "<rootDir>/src/$1", // Maps '@' to the 'src' directory
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Transform TypeScript files
  },
};
