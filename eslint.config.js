// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      "no-unused-vars": "warn",
      "react/display-name": "off",
    },
  },
  {
    ignores: ["dist/*"],
  },
]);
