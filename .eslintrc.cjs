/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier"
  ],
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-alert": "error",
  },
  "env": {
    "node": true,
    "commonjs": true,
    "vue/setup-compiler-macros": true
  },
}
