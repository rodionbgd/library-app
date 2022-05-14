module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    "^.+\\.vue$": "vue-jest"
  },
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx',
  ],
};
